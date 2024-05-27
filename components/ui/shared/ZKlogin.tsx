'use client'

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { SerializedSignature } from '@mysten/sui.js/cryptography';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import {
    genAddressSeed,
    generateNonce,
    generateRandomness,
    getZkLoginSignature,
    jwtToAddress,
} from '@mysten/zklogin';
import { decodeJwt } from 'jose';
import { useEffect, useRef, useState } from 'react';
import { toBigIntBE } from 'bigint-buffer';


const NETWORK = 'devnet';
const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
    url: getFullnodeUrl(NETWORK),
});

/* Local storage keys */

const setupDataKey = 'zklogin-demo.setup';
const accountDataKey = 'zklogin-demo.accounts';

/* Types */

type OpenIdProvider = 'Google';

type SetupData = {
    provider: OpenIdProvider;
    maxEpoch: number;
    randomness: string;
    ephemeralPublicKey: string;
    ephemeralPrivateKey: string;
}

type AccountData = {
    provider: OpenIdProvider;
    userAddr: string;
    zkProofs: any; // TODO: add type
    ephemeralPublicKey: string;
    ephemeralPrivateKey: string;
    userSalt: string;
    sub: string;
    aud: string;
    maxEpoch: number;
}

export default function Home() {

  const accounts = useRef<AccountData[]>(loadAccounts()); // useRef() instead of useState() because of setInterval()
  const [balances, setBalances] = useState<{[address: string]: string}>({}); // Map<Sui address, SUI balance>
  
  useEffect(() => {
    completeZkLogin();

    // fetchBalances(accounts.current);
    // const interval = setInterval(() => fetchBalances(accounts.current), 6_000);
    // return () => clearInterval(interval);
  }, []);

  /* zkLogin logic */

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  async function beginZkLogin(provider: OpenIdProvider) {
      console.log(`🔑 Logging in with ${provider}...`);

      // Create a nonce
      const { epoch } = await suiClient.getLatestSuiSystemState();
      const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
      const randomness = generateRandomness();
      const ephemeralKeyPair = new Ed25519Keypair();
      const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

      console.log(`🔑 Nonce: ${nonce}`)

      const REDIRECT_URL = 'http://localhost:5500'
      const CLIENT_ID = '997997426883-aumbrocqqj4qair1suns53e01pmj3noq.apps.googleusercontent.com' 
      const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid&nonce=${nonce}`
      window.location.replace(loginUrl)

      // Save data to local storage so completeZkLogin() can use it after the redirect
      saveSetupData({
          provider,
          maxEpoch,
          randomness: randomness.toString(),
          ephemeralPublicKey: toBigIntBE(Buffer.from(ephemeralKeyPair.getPublicKey().toSuiBytes())).toString(),
          ephemeralPrivateKey: ephemeralKeyPair.export().privateKey,
      });

      // // Start the OAuth flow with the OpenID provider
      // const urlParamsBase = {
      //     nonce: nonce,
      //     redirect_uri: window.location.origin,
      //     response_type: 'id_token',
      //     scope: 'openid',
      // };
      // let loginUrl: string;
      // switch (provider) {
      //     case 'Google': {
      //         const urlParams = new URLSearchParams({
      //             ...urlParamsBase,
      //             client_id: config.CLIENT_ID_GOOGLE,
      //         });
      //         loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams}`;
      //         break;
      //     }
      // }
      // window.location.replace(loginUrl);
  }
  
  async function completeZkLogin() {
    // Validate the JWT
    // https://docs.sui.io/build/zk_login#decoding-jwt
    const urlFragment = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(urlFragment);
    const jwt = urlParams.get('id_token');
    if (!jwt) {
        return;
    }

    window.history.replaceState(null, '', window.location.pathname); // remove URL fragment
    const jwtPayload = decodeJwt(jwt);
    if (!jwtPayload.sub || !jwtPayload.aud) {
      console.warn('[completeZkLogin] missing jwt.sub or jwt.aud');
      return;
    }

    const userInput = prompt('Enter your password:');
    if (!userInput) {
        console.warn('[completeZkLogin] missing user input');
        return;
    }
    const userSalt = BigInt(hash(userInput));
    const userAddr = jwtToAddress(jwt, userSalt);

    // await requestSuiFromFaucetV0({
    //   host: getFaucetHost(NETWORK),
    //   recipient: userAddr,
    // });

    console.log(`🔑 Logged in as ${userAddr}`);
    

    // Load and clear data from local storage which beginZkLogin() created before the redirect
    const setupData = loadSetupData();
    if (!setupData) {
        console.warn('[completeZkLogin] missing local storage data');
        return;
    }
    clearSetupData();
    for (const account of accounts.current) {
      if (userAddr === account.userAddr) {
          console.warn(`[completeZkLogin] already logged in with this ${setupData.provider} account`); // TODO: replace old with new
          return;
      }
  }

    // Get the zero-knowledge proof
    // https://docs.sui.io/build/zk_login#get-the-zero-knowledge-proof

    const payload = JSON.stringify({
      maxEpoch: setupData.maxEpoch,
      jwtRandomness: setupData.randomness,
      extendedEphemeralPublicKey: setupData.ephemeralPublicKey,
      jwt,
      salt: userSalt.toString(),
      keyClaimName: 'sub',
    }, null, 2);

    console.log('[completeZkLogin] Requesting ZK proof with:', payload);
    console.log('⏳ Requesting ZK proof. This can take a few seconds...')

    const zkProofs = await fetch('https://prover-dev.mystenlabs.com/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
    .then(res => {
        console.debug('[completeZkLogin] ZK proving service success');
        return res.json();
    })
    .catch(error => {
        console.warn('[completeZkLogin] ZK proving service error:', error);
        return null;
    });

    if (!zkProofs) {
        return;
    }

    // Save data to local storage so sendTransaction() can use it
    saveAccount({
      provider: setupData.provider,
      userAddr,
      zkProofs,
      ephemeralPublicKey: setupData.ephemeralPublicKey,
      ephemeralPrivateKey: setupData.ephemeralPrivateKey,
      userSalt: userSalt.toString(),
      sub: jwtPayload.sub,
      aud: typeof jwtPayload.aud === 'string' ? jwtPayload.aud : jwtPayload.aud[0],
      maxEpoch: setupData.maxEpoch,
    });
  }

  // Assemble a zkLogin signature and submit a transaction
  // https://docs.sui.io/build/zk_login#assemble-the-zklogin-signature-and-submit-the-transaction
  async function sendTransaction(account: AccountData) {
    console.log('🚀 Sending transaction...');

    // Sign the transaction bytes with the ephemeral private key.
    const txb = new TransactionBlock();
    txb.setSender(account.userAddr);
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
        Buffer.from(account.ephemeralPrivateKey, 'base64')
    );
    const { bytes, signature: userSignature } = await txb.sign({
        client: suiClient,
        signer: ephemeralKeyPair,
    });

    // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience).
    const addressSeed = genAddressSeed(
        BigInt(account.userSalt),
        'sub',
        account.sub,
        account.aud,
    ).toString();

    // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
    // and the ephemeral signature (userSignature).
    const zkLoginSignature : SerializedSignature = getZkLoginSignature({
        inputs: {
            ...account.zkProofs,
            addressSeed,
        },
        maxEpoch: account.maxEpoch,
        userSignature,
    });

    // Execute the transaction
    await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature: zkLoginSignature,
        options: {
            showEffects: true,
        },
    })
    .then(result => {
        console.debug('[sendTransaction] executeTransactionBlock response:', result);
        fetchBalances([account]);
    })
    .catch(error => {
        console.warn('[sendTransaction] executeTransactionBlock failed:', error);
        return null;
    })
  }

  // Get the SUI balance for each account
  async function fetchBalances(accounts: AccountData[]) {
      if (accounts.length == 0) {
          return;
      }
      const newBalances = {} as {[address: string]: string};
      for (const account of accounts) {
          const suiBalance = await suiClient.getBalance({
              owner: account.userAddr,
              coinType: '0x2::sui::SUI',
          });
          newBalances[account.userAddr] = parseInt(suiBalance.totalBalance)/1e9 + '';
      }
      setBalances(newBalances);
  }

  /* Local storage */

  function saveSetupData(data: SetupData) {
    localStorage.setItem(setupDataKey, JSON.stringify(data))
  }

  function loadSetupData(): SetupData|null {
    const dataRaw = localStorage.getItem(setupDataKey);
    if (!dataRaw) {
      return null;
    }
    const data: SetupData = JSON.parse(dataRaw);
    return data;
  }

  function clearSetupData(): void {
      localStorage.removeItem(setupDataKey);
  }

  function saveAccount(account: AccountData): void {
    const newAccounts = [account, ...accounts.current];
    localStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
    accounts.current = newAccounts;
    fetchBalances([account]);
  }

  function loadAccounts(): AccountData[] {
    const dataRaw = localStorage.getItem(accountDataKey);
    if (!dataRaw) {
      return [];
    }
    const data: AccountData[] = JSON.parse(dataRaw);
    return data;
  }


  return (
    <div className='flex flex-col items-center'>
      <button onClick={() => beginZkLogin('Google')}>Login with Google</button>
      <div>
        <div>Accounts:</div>
        <div>
          {accounts.current.map(acct => {
            const balance = balances[acct.userAddr];
            // const explorerLink = linkToExplorer(NETWORK, 'address', acct.userAddr);
            return (
            <div className='account' key={acct.userAddr}>
              <div>
                <label className={`provider ${acct.provider}`}>{acct.provider}</label>
              </div>
              <div>
                Address: <a target='_blank' rel='noopener'>
                  {shortenAddress(acct.userAddr)}
                </a>
              </div>
              <div>User ID: {acct.sub}</div>
              <div>Balance: {typeof balance === 'undefined' ? '(loading)' : `${balance} SUI`}</div>
              <button
                className={`btn-send ${!balance ? 'disabled' : ''}`}
                disabled={!balance}
                onClick={() => sendTransaction(acct)}
              >
                Send transaction
              </button>
              <hr/>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

function shortenAddress(address: string): string {
  return '0x' + address.slice(2, 8) + '...' + address.slice(-6);
}

function hash(input: string) {
  var hash = 0,
    i, chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
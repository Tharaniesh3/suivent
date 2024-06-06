"use client";
import React, { useEffect, useState } from 'react';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

function createMintNftTxnBlock() {
  const txb = new TransactionBlock();
  const contractAddress =
    "0xe146dbd6d33d7227700328a9421c58ed34546f998acdc42a1d05b4818b49faa2";
  const contractModule = "nft";
  const contractMethod = "mint";
  const nftName = "Suiet NFT";
  const nftDescription = "Hello, Suiet NFT";
  const nftImgUrl = "https://queue-it.com/media/kamjr1q5/nft-ticket.jpg";

  txb.moveCall({
    target: `${contractAddress}::${contractModule}::${contractMethod}`,
    arguments: [
      txb.pure(nftName),
      txb.pure(nftDescription),
      txb.pure(nftImgUrl),
    ],
  });

  return txb;
}
async function succ(){
  alert("Please wait...!");
}
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

export default function Profile() {
  const wallet = useWallet();
  const enokiFlow = useEnokiFlow();
  const client = useSuiClient();

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartEvents, setCartEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const keypair = await enokiFlow.getKeypair({ network: 'testnet' });
        const address = keypair.toSuiAddress();
        setUserAddress(address);
      } catch (error) {
        console.error('Error fetching user address:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartEvents = async () => {
      const mockEvents = [
        { id: '1', name: 'Github Universe 2023', date: '2024-10-10', location: 'San Francisco, CA' },
      ];
      setCartEvents(mockEvents);
    };

    fetchUserAddress();
    fetchCartEvents();
  }, []);

  async function mintNft() {
    if (!wallet.connected) return;

    const txb = createMintNftTxnBlock();
    try {
      const res = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log("NFT minted successfully!", res);
      alert("Congrats! Your NFT is minted!");
    } catch (e) {
      alert("Oops, NFT minting failed");
      console.error("NFT mint failed", e);
    }
  }
  return (
    <div className='mt-20'>
      <div className="container">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : userAddress ? (
        <>
          <p className="user-address mt-10">User Address: {userAddress}</p>
          <center><ConnectButton style={{ backgroundColor: '#624cf5', color: '#ffffff'}} onConnectSuccess={succ} >Connet Wallet</ConnectButton></center>
          <section className='event-section'>
              <h3 className='event-title'>My Event</h3>
          </section>
          <table className="events-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    <button className="mint-button" onClick={mintNft}>Mint NFT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No user address found</p>
      )}
      <style jsx>{`
        .container {
          margin-top: 50px;
          max-width: 800px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        .user-address {
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .event-section {
          background-color: #f7f7f7;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .event-title {
          margin: 0;
          font-size: 24px;
          text-align: center;
          color: #555;
        }

        .events-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .events-table th, .events-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        .events-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .events-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .events-table tr:hover {
          background-color: #f1f1f1;
        }

        .mint-button {
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .mint-button:hover {
          background-color: #0056b3;
        }

        .loader {
          font-size: 20px;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
    </div>
  );
}

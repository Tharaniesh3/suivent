"use client";
import Image from "next/image"
import Link from "next/link"
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui.js/faucet";
import { ExternalLink, Github, LoaderCircle, RefreshCw } from "lucide-react";
import { Card1, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/shared/card1";
import { useAuthCallback } from "@mysten/enoki/react";
import { toast } from "sonner"
import { BalanceChange } from "@mysten/sui.js/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shared/avatar"
import { track } from "@vercel/analytics"
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { Button } from "../button";
import NavItemsWithoutSignIn from "./NavItemsWithoutSignIn";
import { useRouter } from 'next/navigation'


export default function Page() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const client = useSuiClient(); // The SuiClient instance
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance
  const zkLoginState = useZkLogin();
  const router = useRouter(); // Initialize useRouter correctly

  
  const handleLogout = async () => {
    await enokiFlow.logout(); // Ensure logout is completed
    router.push('/'); // Redirect to home page
  };
  /**
   * The current user session, if any. This is used to determine whether the user is logged in or
   * not.
   */
  const [session, setSession] = useState<any | null>(null);

  /* The account information of the current user. */
  const [suiAddress, setSuiAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [accountLoading, setAccountLoading] = useState<boolean>(true);

  /* Transfer form state */
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>('');
  const [transferLoading, setTransferLoading] = useState<boolean>(false);

  /* Counter state */
  const [counter, setCounter] = useState<number>(0);
  const [counterLoading, setCounterLoading] = useState<boolean>(false);
  const [countLoading, setCountLoading] = useState<boolean>(false);

  /**
   * When the page loads, complete the login flow.
   */
  // useEffect(() => {
  //   completeLogin();

  // }, []);
  useAuthCallback();
  /**
   * When the user logs in, fetch the account information.
   */
  // useEffect(() => {
  //   if (session) {
  //     getAccountInfo();
  //     getCount();
  //   }
  // }, [session]);

  /**
   * Complete the Enoki login flow after the user is redirected back to the app.
  //  */
  // const completeLogin = async () => {
  //   try {
  //     await enokiFlow.handleAuthCallback();
  //   } catch (error) {
  //     console.error("Erro handling auth callback", error);
  //   } finally {
  //     // const session = await enokiFlow.getSession();
  //     // console.log("Session", session);
  //     // if (session && session.jwt){
  //     //   setSession(session);
  //     // }
  //     window.history.replaceState(null, "", window.location.pathname);
  //   }
  // };

  const getAccountInfo = async () => {
    setAccountLoading(true);
    const keypair = await enokiFlow.getKeypair({ network: "testnet" });
    const address = keypair.toSuiAddress();
    setSuiAddress(address);
    const balance = await client.getBalance({ owner: address });
    setBalance(parseInt(balance.totalBalance) / 10 ** 9);
    setAccountLoading(false);
  };
  const onRequestSui = async () => {
    const promise = async () => {
      track("Request SUI");
      // Ensures the user is logged in and has a SUI address.
      if (!suiAddress) {
        throw new Error("No SUI address found");
      }

      if (balance > 3) {
        throw new Error("You already have enough SUI!");
      }

      // Request SUI from the faucet.
      const res = await requestSuiFromFaucetV0({
        host: getFaucetHost("testnet"),
        recipient: suiAddress,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      return res;

    };
    toast.promise(promise, {
      loading: 'Requesting SUI...',
      success: (data) => {

        console.log("SUI requested successfully!", data)

        const suiBalanceChange = data.transferredGasObjects.map((faucetUpdate) => {
          return faucetUpdate.amount / 10 ** 9;
        }).reduce((acc: number, change: any) => {
          return acc + change;
        }, 0);
        setBalance( balance + suiBalanceChange );

        return 'SUI requested successfully! ';
      },
      error: (error) => {
        return error.message;
      },
    });
  };

 
  // async function transferSui() {
  //   const promise = async () => {

  //     track("Transfer SUI");

  //     setTransferLoading(true);

  //     // Validate the transfer amount
  //     const parsedAmount = parseFloat(amount);
  //     if (isNaN(parsedAmount)) {
  //       setTransferLoading(false);
  //       throw new Error("Invalid amount");
  //     }

  //     // Get the keypair for the current user.
  //     const keypair = await enokiFlow.getKeypair({ network: "testnet" });

  //     // Create a new transaction block
  //     const txb = new TransactionBlock();

  //     // Add some transactions to the block...
  //     const [coin] = txb.splitCoins(txb.gas, [txb.pure(parsedAmount * 10 ** 9)]);
  //     txb.transferObjects(
  //       [coin],
  //       txb.pure(
  //         recipientAddress
  //       )
  //     );

  //     // Sign and execute the transaction block, using the Enoki keypair
  //     const res = await client.signAndExecuteTransactionBlock({
  //       signer: keypair,
  //       transactionBlock: txb,
  //       options: {
  //         showEffects: true,
  //         showBalanceChanges: true,
  //       },
  //     });

  //     setTransferLoading(false);

  //     console.log("Transfer response", res);

  //     if (res.effects?.status.status !== "success") {
  //       const suiBalanceChange = res.balanceChanges?.filter((balanceChange: BalanceChange) => {
  //         return balanceChange.coinType === "0x2::sui::SUI";
  //       }).map((balanceChange: BalanceChange) => {
  //         return parseInt(balanceChange.amount) / 10 ** 9;
  //       }).reduce((acc: number, change: any) => {
  //         if (change.coinType === "0x2::sui::SUI") {
  //           return acc + parseInt(change.amount);
  //         }
  //         return acc;
  //       }) || 0;
  //       setBalance( balance - suiBalanceChange );
  //       throw new Error("Transfer failed with status: " + res.effects?.status.error);
  //     }
  //     return res;
  //   }

  //   toast.promise(promise, {
  //     loading: 'Transfer SUI...',
  //     success: (data) => {

  //       const suiBalanceChange = data.balanceChanges?.filter((balanceChange: BalanceChange) => {
  //         return balanceChange.coinType === "0x2::sui::SUI";
  //       }).map((balanceChange: BalanceChange) => {
  //         return parseInt(balanceChange.amount) / 10 ** 9;
  //       }).reduce((acc: number, change: any) => {
  //         if (change.coinType === "0x2::sui::SUI") {
  //           return acc + parseInt(change.amount);
  //         }
  //         return acc;
  //       }) || 0;
  //       setBalance( balance - suiBalanceChange );

  //       return <span className="flex flex-row items-center gap-2">Transfer successful! <a href={`https://suiscan.xyz/testnet/tx/${data.digest}`} target='_blank'><ExternalLink width={12}/></a></span>;
  //     },
  //     error: (error) => {
  //       return error.message;
  //     },
  //   });
  // }

  async function getCount() {
    setCountLoading(true);
    const res = await client.getObject({
      id: '0xd710735500fc1be7dc448b783ad1fb0b5fd209890a67e518cc47e7dc26856aa6',
      options: {
        showContent: true
      }
    }) as any;
    setCounter(res.data.content.fields.count as number)
    setCountLoading(false);
  }

  /**
   * Increment the global counter. This transaction is sponsored by the app.
   */
  // async function incrementCounter() {

  //   const promise = async () => {

  //     track("Increment Counter");

  //     setCounterLoading(true);

  //     // Create a new transaction block
  //     const txb = new TransactionBlock();

  //     // Add some transactions to the block...
  //     txb.moveCall({
  //       arguments: [
  //         txb.pure(
  //           "0xd710735500fc1be7dc448b783ad1fb0b5fd209890a67e518cc47e7dc26856aa6"
  //         ),
  //       ],
  //       target:
  //         "0x5794fff859ee70e28ec8a419f2a73830fb66bcaaaf76a68e41fcaf5e057d7bcc::global_counter::increment",
  //     });

  //     try {
  //       // Sponsor and execute the transaction block, using the Enoki keypair
  //       const res = await enokiFlow.sponsorAndExecuteTransactionBlock({
  //         transactionBlock: txb,
  //         network: "testnet",
  //         client,
  //       });
  //       setCounterLoading(false);

  //       return res;
  //     } catch (error) {
  //       setCounterLoading(false);
  //       throw error;
  //     }
  //   }

  //   toast.promise(promise, {
  //     loading: 'Incrementing counter...',
  //     success: (data) => {
  //       getCount();
  //       return <span className="flex flex-row items-center gap-2">Counter incremented! <a href={`https://suiscan.xyz/testnet/tx/${data.digest}`} target='_blank'><ExternalLink width={12}/></a></span>;
  //     },
  //     error: (error) => {
  //       return error.message;
  //     },
  //   });
  // }

  // if (session) {
  //   return (
  //     <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-primary-500/10 backdrop-blur-2xl lg:z-50 bg-white/20">
  //     <div className="wrapper flex items-center justify-between">
  //        <Link href="/" className="w-36">
  //         <Image 
  //           src="/assets/images/logo.png" width={128} height={38}
  //           alt="suivent logo" 
  //         />
  //       </Link>
  //         <nav className="md:flex-between hidden w-full max-w-xs">
  //           <NavItems/>
  //         </nav>
  //       {/* <div className="flex w-32 justify-end gap-3">
  //           <Button asChild className="rounded-full" size="lg" style={{ width: '100%' }}>
  //           <ConnectButton style={{ backgroundColor: '#624cf5', color: '#ffffff' }}>Connect Wallet</ConnectButton>
  //         </Button>
  //       </div> */}
  //       <MobileNav />
  //       <div>
  //       <div style={{ width: '10px' }}>
  //       <Popover>
  //         <PopoverTrigger className="absolute top-4 right-4 max-w-sm" asChild>
  //         <div>
  //             <Button className="hidden sm:block" variant={'secondary'}>
  //               {
  //                 accountLoading ? (
  //                   <LoaderCircle className="animate-spin" />
  //                 ) : (
  //                   `${suiAddress?.slice(0, 5)}...${suiAddress?.slice(63)} - ${balance.toPrecision(3)} SUI`
  //                 )
  //               }
  //             </Button>
  //             <Avatar className="block sm:hidden">
  //               <AvatarImage src="https://github.com/shadcn.png" />
  //               <AvatarFallback>CN</AvatarFallback>
  //             </Avatar>
  //           </div>
  //         </PopoverTrigger>
  //         <PopoverContent>
  //           <Card1 className="border-none shadow-none">
  //           <Button variant={'ghost'} size='icon' className="relative top-0 right-0" onClick={getAccountInfo}><RefreshCw width={16} /></Button>
  //             <CardHeader>
  //               <CardTitle>Account Info</CardTitle>
  //               <CardDescription>View the account generated by Enoki&apos;s zkLogin flow.</CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               {
  //                 accountLoading ? (
  //                   <div className="w-full flex flex-col items-center">
  //                     <LoaderCircle className="animate-spin" />
  //                   </div>
  //                 ) : (
  //                   <>
  //                     <div className="flex flex-row gap-1 items-center">
  //                       <span>Address:{" "}</span>
  //                       {
  //                         accountLoading ? (
  //                           <span>Loading...</span>
  //                         ) : (
  //                           <div className="flex flex-row gap-1">
  //                             <span>{`${suiAddress?.slice(0, 5)}...${suiAddress?.slice(63)}`}</span>
  //                             <a href={`https://suiscan.xyz/testnet/account/${suiAddress}`} target="_blank"><ExternalLink width={12} /></a>
  //                           </div>
  //                         )
  //                       }
  //                     </div>
  //                     <div>
  //                       <span>Balance:{" "}</span>
  //                       <span>{balance.toPrecision(3)} SUI</span>
  //                     </div>
  //                   </>
  //                 )
  //               }
  //             </CardContent>
  //             <CardFooter className="flex flex-row gap-2 items-center justify-between">
  //               {/* <Button variant={'outline'} size={'sm'} onClick={onRequestSui}>
  //                 Request SUI
  //               </Button> */}
  //               <Button
  //                 variant={'destructive'}
  //                 size={'sm'}
  //                 className="w-full text-center"
  //                 onClick={async () => {
  //                   await enokiFlow.logout();
  //                   window.location.pathname ="";
  //                 }}
  //               >
  //                 Logout
  //               </Button>
  //             </CardFooter>
  //           </Card1>
  //         </PopoverContent>
  //       </Popover>
  //       </div>
  //       </div>
  //       </div>
  //   </header>
  //   );
  // }
  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-primary-500/10 backdrop-blur-2xl lg:z-50 bg-white/20">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={128} height={38}
            alt="suivent logo" 
          />
        </Link>

        {isClient && zkLoginState.address && (
          <nav className="hidden md:flex w-full max-w-xs justify-center">
            <NavItems />
          </nav>
        )}

        <div className="flex w-32 justify-end gap-3">
          {isClient ? (
            !zkLoginState.address ? (
              <Button
                onClick={async () => {
                  window.location.href = await enokiFlow.createAuthorizationURL({
                    provider: "google",
                    network: "testnet",
                    clientId: '997997426883-2fsmaltfi1altfgmuut0arecl663pnpk.apps.googleusercontent.com',
                    redirectUrl: "https://suivent.vercel.app",
                  });
                }}
              >
                Sign in with Google
              </Button>
            ) : (
              <Button onClick={handleLogout}>Sign Out</Button>
            )
          ) : null}
        </div>

        <MobileNav />
      </div>
    </header>
  );
};
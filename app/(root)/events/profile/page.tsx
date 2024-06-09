"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useSuiClient } from '@mysten/dapp-kit';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { ethos, SignInButton, TransactionBlock } from 'ethos-connect';
import { Button } from '@/components/ui/button';

// Placeholder for SuccessMessage component
const SuccessMessage = ({ reset, children }) => (
    <div className='bg-green-100 p-4 rounded-md text-center'>
        {children}
        <button onClick={reset} className='ml-4 text-blue-600 underline'>Reset</button>
    </div>
);

const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";

// Renaming the custom Event interface to CartEvent to avoid conflict with DOM Event
interface CartEvent {
    id: string;
    name: string;
    date: string;
    location: string;
}

// The Mint component, as provided
const Mint = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | undefined>();

    const mint = useCallback(async () => {
        if (!wallet?.currentAccount) {
            console.log("Wallet is not connected or no current account found.");
            return;
        }

        try {
            console.log("Starting the mint process...");

            const transactionBlock = new TransactionBlock();
            transactionBlock.moveCall({
                target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
                arguments: [
                    transactionBlock.pure("Ethos Example NFT"),
                    transactionBlock.pure("A sample NFT from Ethos Wallet."),
                    transactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png"),
                ]
            });

            console.log("Transaction block created:", transactionBlock);

            const response = await wallet.signAndExecuteTransactionBlock({
                transactionBlock,
                options: {
                    showObjectChanges: true,
                }
            });

            console.log("Transaction response received:", response);

            if (response?.objectChanges) {
                const createdObject = response.objectChanges.find(
                    (e) => e.type === "created"
                );
                if (createdObject && "objectId" in createdObject) {
                    setNftObjectId(createdObject.objectId);
                    console.log("NFT minted successfully with object ID:", createdObject.objectId);
                } else {
                    console.log("No created object found in response.");
                }
            } else {
                console.log("No object changes found in response.");
            }
        } catch (error) {
            console.error("Error during minting:", error);
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setNftObjectId(undefined);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${nftObjectId}?network=testnet`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the TestNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <Button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
            >
                Mint an NFT
            </Button>
        </div>
    )
}

export default function Profile() {
    const wallet = useWallet();
    const enokiFlow = useEnokiFlow();
    const client = useSuiClient();

    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [cartEvents, setCartEvents] = useState<CartEvent[]>([]); // Use CartEvent instead of Event

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
            const mockEvents: CartEvent[] = [
                { id: '1', name: 'Github Universe 2023', date: '2024-10-10', location: 'San Francisco, CA' },
            ];
            setCartEvents(mockEvents);
        };

        fetchUserAddress();
        fetchCartEvents();
    }, []);

    return (
        <div className='mt-20'>
            <div className="container">
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : userAddress ? (
                    <>
                        <p className="user-address mt-10">User Address: {userAddress}</p>
                        <center></><SignInButton style={{ backgroundColor: '#624cf5', color: '#ffffff'}}>Connect Wallet</SignInButton></center>
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
                                            <Mint /> {/* Replacing mintNft button with Mint component */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>No user address found. Please reload</p>
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

"use client"; 
import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { StrictMode } from "react";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { Chain, EthosConnectProvider } from "ethos-connect";
import { NETWORK } from "./constant";

// Define the network configuration for Sui
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

// Ethos configuration with preferred wallets
const ethosConfiguration = {
  preferredWallets: ['Ethos Wallet'],
  network: NETWORK,
  chain: Chain.SUI_TESTNET
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <EnokiFlowProvider apiKey='enoki_public_3ceeb98095165259c905c55aa38d2dee'>
          <EthosConnectProvider
            ethosConfiguration={ethosConfiguration}
            dappName="Suivents"
            connectMessage="Your connect message goes here!"
          >
            <div className="flex h-screen flex-col">      
              <Header/>
              <main className="flex-1 mt-20">{children}</main>
              <Footer/>
            </div>
          </EthosConnectProvider>
        </EnokiFlowProvider>
      </SuiClientProvider>
    );
  }

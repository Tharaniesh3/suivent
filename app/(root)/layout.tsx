"use client"; 
import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { StrictMode } from "react";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <EnokiFlowProvider apiKey='enoki_public_3ceeb98095165259c905c55aa38d2dee'>
      <WalletProvider>
        <div className="flex h-screen flex-col">      
        <Header/>
        <main className="flex-1 mt-20">{children}</main>
        <Footer/>
        </div>
        </WalletProvider>
  </EnokiFlowProvider>
      </SuiClientProvider>
    );
  }

"use client"; 
import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { StrictMode } from "react";


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <StrictMode>
      <WalletProvider>
        <div className="flex h-screen flex-col">      
        <Header/>
        <main className="flex-1">{children}</main>
        <Footer/>
        </div>
        </WalletProvider>
  </StrictMode>
    );
  }

function getFullnodeUrl(arg0: string): any {
  throw new Error("Function not implemented.");
}
  
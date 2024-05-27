import Footer from "@/components/ui/shared/Footer";
import Header from "@/components/ui/shared/Header";
import { EnokiFlowProvider } from "@mysten/enoki/react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      // <EnokiFlowProvider apiKey='enoki_public_3ceeb98095165259c905c55aa38d2dee'>
        <div className="flex h-screen flex-col">      
        <Header/>
        <main className="flex-1">{children}</main>
        <Footer/>
        </div>
        // </EnokiFlowProvider>
    );
  }

function getFullnodeUrl(arg0: string): any {
  throw new Error("Function not implemented.");
}
  
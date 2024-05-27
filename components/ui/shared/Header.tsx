"use client"; 
import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
import { Button } from "../button"
import { BaseError, ConnectButton, ErrorCode, useWallet } from "@suiet/wallet-kit"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={128} height={38}
            alt="suivent logo" 
          />
        </Link>

          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems/>
          </nav>

        <div className="flex w-32 justify-end gap-3">
            <MobileNav />
            <Button asChild className="rounded-full" size="lg" style={{ width: '100%' }}>
            <ConnectButton style={{ backgroundColor: '#624cf5', color: '#ffffff' }}>Connect Wallet</ConnectButton>
          </Button>

               <section>
        </section>
        </div>
      </div>
    </header>
  )
}

export default Header
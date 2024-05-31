"use client";

import { Button } from "@/components/ui/button";
import EventList from "@/components/ui/shared/EventList";
import Event from "@/lib/database/models/event.model";
import { SuietWallet } from "@suiet/wallet-kit";
import Image from "next/image";
import Link from "next/link"; 


export default function Home() {

  return (
      <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
            Connect, Trust, Celebrate: Your Events, Perfected with Blockchain!
              <p className="p-regular-20 md:p-regular-24">
              Book and gain advice from 5,768+ professionals in leading companies with our secure, global platform.
              </p>
              <Button size="lg" asChild>
                <Link href="#events">
                Explore Now
                </Link>
              </Button>
            </h1>

          </div>
        <Image src={"/assets/images/hero.png"} alt={"hero"} height={1000} width={1000} className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]" />
        </div>
      </section>
      <section id = "events" className="wrapper my-8 flex flex-col gap-89 md:gap-12">
      <h2 className="h2-bold">
      Events<br/> Proven Trustworthiness</h2>
      <div className=" flex w-full flex-col gap-5 md:flex-row"></div>
      {/* CategoryFilter */}
      <EventList/>
      </section>
      </>
  );
}

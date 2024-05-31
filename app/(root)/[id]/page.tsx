"use client"; 
import { SearchParamProps } from '@/types';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    ConnectButton,
    ConnectModal,
    WalletProvider,
  } from '@suiet/wallet-kit';
  import React, { useState } from 'react';
  
  
  
// Define dummy event data
const dummyEvent = {
  _id: '1',
  title: 'Github Universe 2024',
  isFree: false,
  price: 100,
  category: { _id: '1', name: 'AI' },
  organizer: { firstName: '', lastName: '' },
  startDateTime: new Date(),
  endDateTime: new Date(),
  location: 'San Francisco, CA',
  description: 'More than 100 million developers across the world use GitHub. Now in our 10th year, GitHub Universe is the developer event where brands meet their current and future customers to collaborate and shape the future.',
  url: 'https://githubuniverse.com',
  imageUrl: '/assets/images/test1.png',
};
async function succ(){
  alert("Navigate to profile page to mint nft!");
}
const EventDetails = ({ params: { id }, searchParams }: SearchParamProps) => {
  const event = dummyEvent;
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className='h2-bold'>{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  {' '}
                  <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>
            
                <div className="flex flex-col gap-5">
              <div className='flex gap-2 md:gap-3'>
                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    Thu, Oct 29, 2024 7:03 PM  -  Fri, Oct 30, 2024 7:03 PM
 
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>   

              <ConnectButton style={{ backgroundColor: '#624cf5', color: '#ffffff'}} onConnectSuccess={succ} >Connet Wallet</ConnectButton>   
       
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">What You'll Learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">{event.url}</p>
            </div>
          </div>
        </div>
      </section>
    </>

  )
}

export default EventDetails

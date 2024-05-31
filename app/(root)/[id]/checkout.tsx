"use client"; 

import { useRouter } from 'next/router';
import React from 'react';
import { formatDateTime } from '@/lib/utils';

const Checkout = () => {
  const router = useRouter();
  const { event } = router.query;

  const eventDetails = event ? JSON.parse(Array.isArray(event) ? event[0] : event) : null;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {eventDetails ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">{eventDetails.title}</h2>
          <p><strong>Category:</strong> {eventDetails.category.name}</p>
          <p><strong>Location:</strong> {eventDetails.location}</p>
          <p><strong>Start Date:</strong> {formatDateTime(new Date(eventDetails.startDateTime)).dateOnly} - {formatDateTime(new Date(eventDetails.startDateTime)).timeOnly}</p>
          <p><strong>End Date:</strong> {formatDateTime(new Date(eventDetails.endDateTime)).dateOnly} - {formatDateTime(new Date(eventDetails.endDateTime)).timeOnly}</p>
          <p><strong>Description:</strong> {eventDetails.description}</p>
          <p><strong>Price:</strong> {eventDetails.isFree ? 'FREE' : `$${eventDetails.price}`}</p>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};

export default Checkout;

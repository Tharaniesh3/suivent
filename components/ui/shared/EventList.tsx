import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import { DeleteConfirmation } from './DeleteConfirmation'; // Assume this component handles delete confirmation

const fakeEvents = [
  {
    _id: '1',
    imageUrl: '/assets/images/test1.png',
    isFree: false,
    price: 100,
    category: { name: 'AI' },
    startDateTime: new Date(),
    title: 'Github Universe 2024',
    organizer: {
      _id: '123',
    },
  },
];

const auth = () => ({
  sessionClaims: { userId: '123' }, // Assume the logged-in user has this userId
});

type IEvent = typeof fakeEvents[0];

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink = true, hidePrice = false }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id.toString();
  const isFirstEvent = fakeEvents[0]._id === event._id; // Check if the event is the first one in the array

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/orders?eventId=${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      {isFirstEvent && isEventCreator && !hidePrice && ( // Conditionally render only for the first event
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          {/* <Link href={`/orders?eventId=${event._id}`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link> */}
      <h5 style={{ color: 'green' }}>Live</h5>
          {/* <DeleteConfirmation eventId={event._id} /> */}
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}

        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/orders?eventId=${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{event.title}</p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {/* Organizer ID: {event.organizer._id} */}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Event Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


const EventList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fakeEvents.map(event => (
        <Card key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventList;

import EventForm from '@/components/ui/shared/EventForm'
import React from 'react'

const CreateEvent = () => {
  return (
    <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
    </section>
    <div className=' wrapper my-8'>
    <EventForm userId={''} type={'Create'}/>
    </div>
</> 
  )
}

export default CreateEvent


// <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Input placeholder="Event title" {...field} className="input-field" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="categoryId"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                <FormControl>
//                   <Input placeholder="Category" {...field} className="input-field" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl className="h-72">
//                   <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="imageUrl"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl className="h-72">
//                   <FileUploader 
//                     onFieldChange={field.onChange}
//                     imageUrl={field.value}
//                     setFiles={setFiles}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="location"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/location-grey.svg"
//                       alt="calendar"
//                       width={24}
//                       height={24}
//                     />
//                     <Input placeholder="Event location or Online" {...field} className="input-field" />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="startDateTime"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/calendar.svg"
//                       alt="calendar"
//                       width={24}
//                       height={24}
//                       className="filter-grey"
//                     />
//                     <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
//                     <DatePicker 
//                       selected={field.value} 
//                       onChange={(date: Date) => field.onChange(date)} 
//                       showTimeSelect
//                       timeInputLabel="Time:"
//                       dateFormat="MM/dd/yyyy h:mm aa"
//                       wrapperClassName="datePicker"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="endDateTime"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/calendar.svg"
//                       alt="calendar"
//                       width={24}
//                       height={24}
//                       className="filter-grey"
//                     />
//                     <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
//                     <DatePicker 
//                       selected={field.value} 
//                       onChange={(date: Date) => field.onChange(date)} 
//                       showTimeSelect
//                       timeInputLabel="Time:"
//                       dateFormat="MM/dd/yyyy h:mm aa"
//                       wrapperClassName="datePicker"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/dollar.svg"
//                       alt="dollar"
//                       width={24}
//                       height={24}
//                       className="filter-grey"
//                     />
//                     <Input type="number" placeholder="Price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
//                     <FormField
//                       control={form.control}
//                       name="isFree"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="flex items-center">
//                               <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
//                               <Checkbox
//                                 onCheckedChange={field.onChange}
//                                 checked={field.value}
//                                 id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />   
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />   
//           <FormField
//             control={form.control}
//             name="url"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/link.svg"
//                       alt="link"
//                       width={24}
//                       height={24}
//                     />
//                     <Input placeholder="URL" {...field} className="input-field" />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
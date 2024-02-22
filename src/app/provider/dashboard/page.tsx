"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { SlotsCard } from "@/components/Provider/SlotsCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CalendarCheck2, CalendarIcon, Edit } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EditOffDuration } from "@/components/Provider/DialogEditOffDur";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTable from "@/components/Provider/DataTable";

const Services = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const router = useRouter();
  const { auth } = useAuth();
  const [filteredSlots, setFilteredSlots] = useState(auth?.provider?.slots);
  const [filteredOfsc, setfilteredOfsc] = useState(
    auth?.provider?.offlineSchedules
  );

  const [offlineDuration, setOfflineDuration] = useState<number>(
    auth?.provider?.offlineDuration || 0
  );
  useEffect(() => {
    if (!date) return;
    const newDate = new Date(date);
    if (!mounted) {
      newDate.setDate(newDate.getDate() - 1);
      setMounted(true);
    }
    newDate.setDate(newDate.getDate() + 1);

    const nextDayISOString = newDate.toISOString().split("T")[0];

    const filtered = auth?.provider?.slots?.filter(
      (slot) => slot.date === nextDayISOString
    );
    const filteredofs = auth?.provider?.offlineSchedules?.filter(
      (slot) => slot.date === nextDayISOString
    );
    setfilteredOfsc(filteredofs);
    setFilteredSlots(filtered || []);
  }, [date, auth?.provider?.slots]);

  // const userOfflineSchedules : User = auth?.provider?.offlineSchedules?.map((data) => {
  //   return {
  //     name: data.user?.name,
  //     email: data.user?.email,
  //     mobile : data?.user?.mobile
  //     }
  //   })

  if (!auth?.provider) {
    toast.message("Please Login As Provider");
    setTimeout(() => {
      router.push("/sign-in?as=provider");
    }, 1000);
    return (
      <div className="relative">
        <div className="absolute left-1/2">
          Please Login As A Provider to Continue
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="absolute left-1/2">Loading...</div>}>
      <Sheet key={"right"}>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          {" "}
          <section className="p-4">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-4xl font-bold tracking-tight">
                  Welcome back!
                </h2>
                <p className="text-muted-foreground my-4">
                  Manage your Slots, Meetings and Offline Schedules Here!
                </p>
              </div>
              <div>Hi , {auth.provider.name}</div>
            </div>
          </section>
          <Popover>
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight my-4">
                    Slots
                  </h2>
                </div>
                <div>
                  <PopoverTrigger asChild>
                    <CalendarIcon className="ml-auto h-6 w-6 opacity-50 cursor-pointer" />
                  </PopoverTrigger>{" "}
                  <PopoverContent
                    className="w-auto p-0 bg-slate-300 mr-4"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow"
                    />
                  </PopoverContent>
                </div>
              </div>
              {filteredSlots?.map((slot) => (
                <SlotsCard
                  key={`${slot.date}-${slot.id}`}
                  date={slot?.date}
                  slotTime={slot?.slotTime}
                  slotStatus={slot?.slotStatus}
                  slotDuration={slot?.slotDuration}
                  meetings={slot.meetings}
                />
              ))}
            </div>
          </Popover>
          <div className="p-6 pt-0">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight my-4 text-gray-800">
                  Offline Schedules
                </h2>
              </div>
              <div>
                <SheetTrigger asChild>
                  <button className="flex flex-col p-1 bg-green-200 hover:bg-green-300 text-green-800 font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out items-center space-x-2">
                    <CalendarCheck2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Schedule</span>
                    <span className="block text-xs text-green-600">
                      Offline Meeting
                    </span>
                  </button>
                </SheetTrigger>
                <SheetContent side={"right"}>
                  <div className="">
                    <SheetHeader>
                      <SheetTitle className="flex text-center justify-between mx-auto align-middle text-2xl">
                        Schedule Offline Meeting
                      </SheetTitle>
                      <SheetDescription className="flex items-center justify-center mx-auto">
                        Here are some of the suggestions where you can schedule
                        offline meeting wit your offline duration period
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex justify-between items-center mx-auto">
                        <h2 className="flex items-center whitespace-nowrap">
                          <span className="mr-2">
                            Current Offline Duration :
                          </span>
                          <span className="font-bold">
                            {offlineDuration} hrs
                          </span>
                          <span
                            className="ml-2 cursor-pointer"
                            onClick={() => {
                              setOpenPopup(true);
                            }}
                          >
                            <SheetClose asChild>
                              <Edit />
                            </SheetClose>
                          </span>
                        </h2>
                      </div>
                      <div className="">
                        <DataTable
                          slots={filteredSlots || []}
                          offlineSchedules={auth?.provider?.offlineSchedules}
                          offlineDuration={offlineDuration}
                        />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </SheetContent>
              </div>
            </div>
            <Table className="border my-4">
              <TableCaption>A list of your offline schedules.</TableCaption>
              <TableHeader>
                <TableRow className="bg-slate-300 hover:bg-slate-200">
                  <TableHead>Offline Slot Date</TableHead>
                  <TableHead>Offline Slot Time</TableHead>
                  <TableHead>Offline Slot Duration (Hrs)</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfsc?.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting?.date}</TableCell>
                    <TableCell>{meeting?.offlineSlotTime}</TableCell>

                    <TableCell>{meeting?.offlineSlotDuration}</TableCell>

                    <TableCell className="font-medium">
                      {meeting?.user?.name}
                    </TableCell>
                    <TableCell>{meeting?.user?.email}</TableCell>
                    <TableCell>{meeting?.user?.mobile}</TableCell>
                    <TableCell> {meeting?.priority}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Sheet>
      <EditOffDuration
        open={openPopup}
        setOpen={setOpenPopup}
        offlineDuration={offlineDuration}
        setOfflineDuration={setOfflineDuration}
      />
    </Suspense>
  );
};

export default Services;

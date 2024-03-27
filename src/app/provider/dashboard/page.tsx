"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { SlotsCard } from "@/components/Provider/SlotsCard";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Edit2Icon } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { EditSlotPopup } from "@/components/Provider/EditSlotsPopup";
import OfflineSlots from "@/components/Provider/OfflineSlots";
import ShortestCircularPath from "@/components/Provider/ShortestCircularPath";
import { OfflineMeetingPopup } from "@/components/Provider/offlineMeetingReqsPopup";

const Services = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
    const [openOfflineMeetingReq, setopenOfflineMeetingReq] = useState(false);

  const router = useRouter();
  const { auth } = useAuth();
  const [filteredSlots, setFilteredSlots] = useState(auth?.provider?.slots);
  const [filteredOfsc, setfilteredOfsc] = useState(
    auth?.provider?.offlineSchedules
  );
  const [filteredOfscForSp, setfilteredOfscForSp] = useState(
    auth?.provider?.offlineSchedules
  );
  const [selectedSlots, setSelectedSlots] = useState<number[]>(
    auth?.provider?.slotsArray ? auth?.provider?.slotsArray : []
  );
  useEffect(() => {
    if (!date) return;
    const newDate = new Date(date);
    if (!mounted) {
      newDate.setDate(newDate.getDate());
      setMounted(true);
    }
    newDate.setDate(newDate.getDate());

    const nextDayISOString = newDate.toISOString().split("T")[0];
    console.log(nextDayISOString);
    const filtered = auth?.provider?.slots
      ?.filter((slot) => slot.date === nextDayISOString)
      .sort((a, b) => {
        const hourA = parseInt(a.slotTime.split(":")[0]);
        const hourB = parseInt(b.slotTime.split(":")[0]);
        return hourA - hourB;
      });

    const filteredofs = auth?.provider?.offlineSchedules?.filter(
      (slot) => slot.date === nextDayISOString
    );
    setfilteredOfscForSp(filteredofs);

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
      router.push("/sign-in");
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
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex ">
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
            <div className="p-6">
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight my-4">
                    Slots{" "}
                    <Edit2Icon
                      className="inline-block h-6 w-6 text-gray-500 cursor-pointer"
                      onClick={() => setOpen(true)}
                    />
                  </h2>
                </div>
                <div>
                  <PopoverTrigger asChild>
                    <CalendarIcon className="ml-auto h-6 w-6 opacity-50 cursor-pointer" />
                  </PopoverTrigger>{" "}
                  <PopoverContent
                    className="w-auto p-0 bg-slate-300 mr-4 mt-10"
                    align="center"
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
              <div className="grid grid-cols-4 gap-4">
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
            </div>
          </Popover>
          <button className="flex flex-col p-1 hover:bg-custom bg-slate-200  font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out items-center space-x-2" onClick={() => setopenOfflineMeetingReq(true)}>
            <span className="text-xl font-medium">Offline</span>
            <span className="block text-xs text-slate-600">
              Meeting Requests
            </span>
          </button>
          <OfflineSlots
            offlineDur={auth?.provider?.offlineDuration || 2}
            filteredOfsc={filteredOfsc}
          />
          <ShortestCircularPath
            filteredOfsc={filteredOfsc}
            lat={auth?.provider?.lat}
            long={auth?.provider?.long}
          />
        </div>
      </Sheet>
      {open && (
        <EditSlotPopup
          open={open}
          setOpen={setOpen}
          selectedSlots={selectedSlots}
        />
      )}
      {openOfflineMeetingReq && <OfflineMeetingPopup open={openOfflineMeetingReq} setOpen={setopenOfflineMeetingReq} meetings={auth?.provider?.OnlineMeetingReq} />}
    </Suspense>
  );
};

export default Services;

"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { perks } from "@/components/Perks";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { SlotsCard } from "@/components/Provider/SlotsCard";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";

const Services = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const router = useRouter();
  const { auth } = useAuth();
  const [filteredSlots, setFilteredSlots] = useState(auth?.provider?.slots);
  useEffect(() => {
    if (!date) return;
    const filtered = auth?.provider?.slots?.filter(
      (slot) => slot.date === date.toUTCString().split("T")[0]
    );
    setFilteredSlots(filtered || []);
  }, [date, auth?.provider?.slots]);
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
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {" "}
        <section className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
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
                <h2 className="text-3xl font-semibold tracking-tight m-4">
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
      </div>
    </Suspense>
  );
};

export default Services;

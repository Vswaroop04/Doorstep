"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { perks } from "@/components/Perks";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { SlotsCard } from "@/components/Provider/SlotsCard";

const Services = () => {
  const router = useRouter();
  const { auth } = useAuth();
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
        <div className="p-6 pt-0">
          <h2 className="text-3xl font-semibold tracking-tight m-4">Slots</h2>
          <div className="grid grid-cols-4 gap-4">
            {auth.provider?.slots?.map((slot) => (
              <SlotsCard
                key={slot?.date}
                date={slot?.date}
                slotTime={slot?.slotTime}
                slotStatus={slot?.slotStatus}
                slotDuration={slot?.slotDuration}
                meetings={slot.meetings}
              />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Services;

"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { perks } from "@/components/Perks";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { OfflineMeetingCard } from "@/components/user/OfflineScheduleCard";
import { MeetingCard } from "@/components/user/MeetingsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Services = () => {
  const router = useRouter();
  const { auth } = useAuth();
  console.log(auth);
  if (!auth?.user) {
    toast.message("Please Login As User");
    setTimeout(() => {
      router.push("/sign-in");
    }, 1000);
    return (
      <div className="relative">
        <div className="absolute left-1/2">
          Please Login As A User to Continue
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="absolute left-1/2">Loading...</div>}>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-1">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground ">
              Here&apos;s a list of your meetings and offline schedules
            </p>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12 rounded-full mr-4">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>CN </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-base font-semibold leading-tight mb-1">
                  {auth?.user?.name}
                </p>
                <p className="text-sm text-gray-500"> {auth?.user?.email}</p>
                <p className="text-sm text-gray-500"> {auth?.user?.mobile}</p>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-normal tracking-tight flex justify-center mx-auto">
          Meetings
        </h2>
        {auth?.user?.meetings && auth?.user?.meetings.length > 0 ? (
          <div className="grid grid-cols-3 space-x-4 space-y-4 ">
            {auth?.user?.meetings?.map((ofsc) => (
              <MeetingCard
                key={ofsc.id}
                providerName={ofsc.slot?.provider?.name}
                serviceName={ofsc.slot?.provider?.serviceName}
                date={ofsc.slot?.date}
                providerEmail={ofsc.slot?.provider?.email}
                providerMobile={ofsc.slot?.provider?.mobile}
                slotStatus={ofsc.slot?.slotStatus}
                slotTime={ofsc.slot?.slotTime}
                slotDuration={ofsc.slot?.slotDuration}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mx-auto">
            No Offline Meetings currently{" "}
          </div>
        )}{" "}
        <h2 className="text-2xl font-normal tracking-tight  justify-center mx-auto">
          Offline Schedules
        </h2>
        <div className="">
          {auth?.user?.offlineSchedules &&
          auth?.user?.offlineSchedules.length > 0 ? (
            <OfflineMeetingCard
              offlineSchedules={auth?.user?.offlineSchedules}
            />
          ) : (
            <div className="flex justify-center mx-auto">
              {" "}
              No Offline Schedules currently{" "}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default Services;

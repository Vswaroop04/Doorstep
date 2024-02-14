"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { perks } from "@/components/Perks";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { OfflineMeetingCard } from "@/components/user/OfflineScheduleCard";
import { MeetingCard } from "@/components/user/MeetingsCard";

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
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your services
            </p>
          </div>
          <div>Hi , {auth.user.name}</div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Offline Schedules</h2>
        <div className="grid grid-cols-3">
          {auth?.user?.offlineSchedules?.map((ofsc) => (
            <OfflineMeetingCard
              key={ofsc.id}
              providerName={ofsc.provider?.name}
              serviceName={ofsc.provider?.serviceName}
              date={ofsc.date}
              offlineDuration={ofsc.offlineSlotDuration}
              offlineSlotTime={ofsc.offlineSlotTime}
              providerEmail={ofsc.provider?.email}
              providerMobile={ofsc.provider?.mobile}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Meetings</h2>
        <div className="grid grid-cols-3">
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
      </div>
      <div>
        {" "}
        <p className="text-xl text-center flex flex-col items-center">
          {" "}
          Explore Our Other Services{" "}
        </p>
        <section className="border-t border-gray-200 bg-gray-50 py-4 ">
          <MaxWidthWrapper>
            <div className="grid grid-cols-1 gap-y-12 sm:gap-x-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
              {perks.map((perk) => (
                <div
                  key={perk.name}
                  className="cursor-pointer text-center md:flex md:items-start md:text-left lg:block lg:text-center lg:my-10"
                  onClick={() => {
                    router.push(perk.href);
                  }}
                >
                  <div className="md:flex-shrink-0 flex justify-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                      {<perk.Icon className="w-1/3 h-1/3" />}
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MaxWidthWrapper>
        </section>
      </div>
    </Suspense>
  );
};

export default Services;
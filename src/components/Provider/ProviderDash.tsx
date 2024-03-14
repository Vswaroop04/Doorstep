"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetProviderById } from "@/lib/fetchers/getProviderById";
import { TypeProviderObj } from "@/lib/fetchers/getProviders";
import { TypeProvider } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../home/Loading";
import { Calendar, PinIcon, StarIcon } from "lucide-react";
import SimpleMap from "./Map";
import Ratings from "./Ratings";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RequestSlot } from "../form/RequestSlot";
const ProviderDash = ({ providerId }: { providerId: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [provider, setProvider] = useState<TypeProviderObj>();
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const fetchedProvider = await GetProviderById(providerId);
        if (!fetchedProvider) {
          toast.error("This provider does not exist");
          router.push("/");
        } else {
          setProvider(fetchedProvider.provider);
        }
      } catch (error) {
        toast.error("Failed to fetch provider");
        router.push("/");
      }
    };

    fetchProvider();
  }, [providerId, router]);

  if (!provider) {
    return <Loading />;
  }

  return (
    <div>
      {" "}
      <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {provider.name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h2>
              <p className="text-sm text-gray-500 py-1">
                {provider.serviceName}
              </p>

              <p className="text-sm text-gray-500 py-1">{provider.email}</p>
              <p className="text-sm text-gray-500 py-1">{provider.mobile}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-t-lg rounded-l-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div>Online Price</div>
                <div className="mt-1">$ {provider.onlinePrice}</div>
              </div>
              <div className="rounded-t-lg rounded-r-lg px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div>Offline Price</div>
                <div className="mt-1">$ {provider.offlinePrice}</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Rating
                    </CardTitle>
                    <StarIcon />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {provider.averageRating?.toPrecision(5) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Offline Duration
                    </CardTitle>
                    <Calendar />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {provider.offlineDuration} Hr(s)/Day
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Offline Schedules
                    </CardTitle>
                    <PinIcon />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {provider.offlineSchedules?.length > 0
                        ? provider.offlineSchedules?.length
                        : 1}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +10% from last day
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Slots</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {" "}
                      {provider?.slotsArray?.length
                        ? provider?.slotsArray?.length
                        : 4}
                      /Day
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +0 from yesterday
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h1 className="text-2xl p-2 font-bold"> Provider Location </h1>
                <SimpleMap lat={provider.lat} long={provider.long} />
              </div>
              <div>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Ratings provider={provider} />
                  </CardContent>
                </Card>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex align-middle justify-center text-center pt-10">
                    <Button variant={"ghost"} className="bg-black text-white">
                      {" "}
                      Book Appointment{" "}
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogTitle className="p-4 text-center">
                    Slots of {provider?.name}
                  </DialogTitle>
                  <div> Date : {todayDate} </div>
                  <div className="grid grid-cols-4 gap-6">
                    {provider?.slots
                      .filter((slot: any) => slot.date === todayDate)
                      .sort((a: any, b: any) => {
                        const hourA = parseInt(a.slotTime.split(":")[0]);
                        const hourB = parseInt(b.slotTime.split(":")[0]);
                        return hourA - hourB;
                      })
                      .map((slot: any) => (
                        <>
                          <Button
                            variant={"default"}
                            key={slot.id}
                            className={`border p-1 outline ${
                              parseInt(currentTime.slice(0, 2)) >
                              parseInt(slot.slotTime.slice(0, 2))
                                ? "bg-red-50"
                                : "bg-blue-100"
                            }`}
                            onClick={() => {
                              setSlot(slot);
                              setOpen(true);
                            }}
                            disabled={
                              parseInt(currentTime.slice(0, 2)) >
                                parseInt(slot.slotTime.slice(0, 2)) ||
                              slot.slotStatus === "Scheduled"
                            }
                          >
                            {slot.slotTime}
                          </Button>
                        </>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
              {open && (
                <RequestSlot open={open} setOpen={setOpen} slot={slot} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </>
    </div>
  );
};

export default ProviderDash;

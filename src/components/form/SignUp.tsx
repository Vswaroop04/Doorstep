"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import DropdownMenu from "@/components/form/DropDownMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, LocateFixed, LocateFixedIcon, LocateIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";

export default function SignUpComponent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("user");
  const [isGPSLoading, setIsGPSLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const search = searchParams.get("as");
  useEffect(() => {
    if (search === "provider") {
      setActiveTab("provider");
    } else {
      setActiveTab("user");
    }
  }, [search]);
  const handleLocationClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsGPSLoading(true);
    if ("geolocation" in window.navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(lat, lng);
        } catch (e) {
          console.error("Error retrieving geolocation:", e);
        }
        setIsGPSLoading(false);
      });
    } else {
      console.error("Geolocation not supported");
      setIsGPSLoading(false);
    }
  };

  return (
    <MaxWidthWrapper className="flex justify-center items-center mt-16">
      <Tabs
        value={search ? activeTab : undefined}
        defaultValue="user"
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="provider">Provider</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User SignUp</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <div className="text-gray-700">
                    Please Sign Up as a user to explore our services
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-700">
                      Already have an Account ? {""}
                    </span>
                    <Link href="/sign-in" className="underline text-blue-500">
                      Sign In
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Mobile</Label>
                <Input
                  id="number"
                  placeholder="Mobile"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  id="password"
                  placeholder="*****"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1 pl-4 pt-4">
                <>
                  {isGPSLoading ? (
                    <Loader className="col-span-1 m-auto flex animate-spin items-center justify-center" />
                  ) : (
                    <Button
                      className="flex gap-2 border-brand-verified text-brand-verified hover:text-brand-verified"
                      variant={"secondary"}
                      onClick={handleLocationClick}
                    >
                      <LocateFixed size={32} />
                      <span>Detect your location automatically</span>
                    </Button>
                  )}
                </>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"outline"} className="mx-auto">
                {" "}
                Sign Up{" "}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Provider SignUp</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <div className="text-gray-700">
                    Please Sign Up as a provider to explore our services
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-700">
                      Already have an Account ? {""}
                    </span>
                    <Link href="/sign-in" className="underline text-blue-500">
                      Sign In
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Mobile</Label>
                <Input
                  id="number"
                  placeholder="Mobile"
                  className="text-slate-400"
                />
              </div>
              <DropdownMenu />

              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  id="password"
                  placeholder="*****"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Offline Duration (Hrs)</Label>
                <Input
                  id="number"
                  placeholder="1.5"
                  className="text-slate-400"
                />
              </div>
              <div className="space-y-1 pl-4 pt-4">
                <>
                  {isGPSLoading ? (
                    <Loader className="col-span-1 m-auto flex animate-spin items-center justify-center" />
                  ) : (
                    <Button
                      className="flex gap-2 border-brand-verified text-brand-verified hover:text-brand-verified"
                      variant={"secondary"}
                      onClick={handleLocationClick}
                    >
                      <LocateFixed size={32} />
                      <span>Detect your location automatically</span>
                    </Button>
                  )}
                </>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"outline"} className="mx-auto">
                {" "}
                Sign Up{" "}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}

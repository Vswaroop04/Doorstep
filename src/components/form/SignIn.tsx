"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
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
import { getAllServices } from "@/lib/fetchers/getAllServices";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInComponent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("user");
  const search = searchParams.get("as");
  useEffect(() => {
    if (search === "provider") {
      setActiveTab("provider");
    } else {
      setActiveTab("user");
    }
  }, [search]);
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
              <CardTitle>User Login</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <div className="text-gray-700">
                    Please Sign In as a user to explore our services
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-700">
                      New to Doorstep ? {""}
                    </span>
                    <Link href="/sign-up" className="underline text-blue-500">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="xyz@gmail.com"
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
              
            </CardContent>
            <CardFooter>
              <Button variant={"outline"} className="mx-auto">
                {" "}
                Sign In{" "}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Provider Login</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <div className="text-gray-700">
                    Please Sign In as a provider to provide services
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-700">
                      New to Doorstep ? {""}
                    </span>
                    <Link href="/sign-up" className="underline text-blue-500">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="xyz@gmail.com"
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
            </CardContent>
            <CardFooter>
              <Button variant={"outline"} className="mx-auto">
                {" "}
                Sign In{" "}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}

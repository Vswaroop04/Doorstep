"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginSchema } from "./FormSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { userSignup } from "@/lib/fetchers/UserSignIn";
import { providerSignUp } from "@/lib/fetchers/ProviderSignIn";
import useAuth from "@/hooks/useAuth";

export default function SignInComponent() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const LoginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  const mutation = useMutation({
    mutationFn: userSignup,
    onError: (error, variables, context) => {
      toast.error(error.message);
    },

    onSuccess: (data, variables, context) => {
      toast.success(data.message);
      setAuth(data);
      router.push("/");
    },
  });
  const providerMutation = useMutation({
    mutationFn: providerSignUp,
    onError: (error, variables, context) => {
      toast.error(error.message);
    },

    onSuccess: (data, variables, context) => {
      toast.success(data.message);
      setAuth(data);
      router.push("/provider/dashboard");
    },
  });

  function UserSignIn(values: z.infer<typeof LoginSchema>) {
    toast.info("Trying to Sign In...", { id: "loading", duration: 500 });
    mutation.mutate(values);
  }

  function ProviderSignIn(values: z.infer<typeof LoginSchema>) {
    toast.info("Trying to Sign In ...", { id: "loading", duration: 500 });
    providerMutation.mutate(values);
  }

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
          <Form {...LoginForm}>
            <form
              onSubmit={LoginForm.handleSubmit(UserSignIn)}
              className="space-y-8"
            >
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
                        <Link
                          href="/sign-up"
                          className="underline text-blue-500"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormField
                    control={LoginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Email"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={LoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button variant={"outline"} className="mx-auto">
                    {" "}
                    Sign In{" "}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="provider">
          <Form {...LoginForm}>
            <form
              onSubmit={LoginForm.handleSubmit(ProviderSignIn)}
              className="space-y-8"
            >
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
                        <Link
                          href="/sign-up"
                          className="underline text-blue-500"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormField
                    control={LoginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Email"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={LoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button variant={"outline"} className="mx-auto">
                    {" "}
                    Sign In{" "}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}

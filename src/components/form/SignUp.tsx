"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, LocateFixed, LocateFixedIcon, LocateIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { userSignup } from "@/lib/fetchers/userSignup";
import { providerSignUp } from "@/lib/fetchers/providerSignup";
import { getAllServices } from "@/lib/fetchers/getAllServices";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { providerFormSchema, userFormSchema } from "./FormSchema";

export default function SignUpComponent() {
  const router = useRouter();
  const UserSignUpForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });
  const ProviderSignupForm = useForm<z.infer<typeof providerFormSchema>>({
    resolver: zodResolver(providerFormSchema),
  });

  function UserSignUp(values: z.infer<typeof userFormSchema>) {
    toast.info("Creating Account ...", { id: "loading", duration: 500 });

    mutation.mutate({ lat: location.lat, long: location.long, ...values });
    toast.dismiss("loading");
  }
  function ProviderSignUp(values: z.infer<typeof providerFormSchema>) {
    toast.info("Creating Account ..", { id: "loading", duration: 500 });

    providerMutation.mutate({
      lat: location.lat,
      long: location.long,
      ...values,
    });
    toast.dismiss("loading");
  }
  const mutation = useMutation({
    mutationFn: userSignup,
    onError: (error, variables, context) => {
      toast.error(error.message);
    },

    onSuccess: (data, variables, context) => {
      toast.success(data.message);
      toast.info("Please Login To Continue");

      router.push("/sign-in?as=user");
    },
  });
  const providerMutation = useMutation({
    mutationFn: providerSignUp,
    onError: (error, variables, context) => {
      toast.error(error.message);
    },

    onSuccess: (data, variables, context) => {
      toast.success(data.message);
      toast.info("Please Login To Continue");

      router.push("/sign-in?as=provider");
    },
  });

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("user");
  const [isGPSLoading, setIsGPSLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; long: number }>({
    lat: 45.501,
    long: 73.567,
  });

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
          const long = position.coords.longitude;
          setLocation({ lat, long });
        } catch (e) {
          console.error("Error retrieving geolocation:", e);
        }
        toast.info("Your location has been updated!");
        setIsGPSLoading(false);
      });
    } else {
      console.error("Geolocation not supported");
      setIsGPSLoading(false);
    }
  };

  const [options, setOptions] = useState([{ serviceName: "Plumber" }]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const services = await getAllServices(10);
        setOptions(services.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
    fetchServices();
  }, []);

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
              {" "}
              {mutation.error && (
                <h5
                  className="text-red-600 text-lg"
                  onClick={() => mutation.reset()}
                >
                  {mutation.error.message}
                </h5>
              )}
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
            <Form {...UserSignUpForm}>
              <form
                onSubmit={UserSignUpForm.handleSubmit(UserSignUp)}
                className="space-y-8"
              >
                <CardContent className="space-y-2">
                  <FormField
                    control={UserSignUpForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Name"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={UserSignUpForm.control}
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
                    control={UserSignUpForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">Mobile</FormLabel>
                        <FormControl>
                          <Input
                            id="mobile"
                            placeholder="Mobile"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={UserSignUpForm.control}
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

                  <div className="space-y-1 pt-4">
                    <>
                      {isGPSLoading ? (
                        <Loader className="col-span-1 m-auto flex animate-spin items-center justify-center" />
                      ) : (
                        <>
                          <Label className="pb-2 font-medium">
                            Location :{" "}
                          </Label>

                          <div className="outline-dotted">
                            <Button
                              className="flex gap-2 border-brand-verified text-brand-verified hover:text-brand-verified"
                              variant={"secondary"}
                              onClick={handleLocationClick}
                              type="button"
                            >
                              <LocateFixed size={32} />
                              <span>Detect your location automatically</span>
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={"outline"} className="mx-auto" type="submit">
                    {" "}
                    Sign Up{" "}
                  </Button>
                </CardFooter>
              </form>
            </Form>
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
                      {mutation?.isPending ? "Creating Account..." : "Sign Up"}
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <Form {...ProviderSignupForm}>
              <form
                onSubmit={ProviderSignupForm.handleSubmit(ProviderSignUp)}
                className="space-y-8"
              >
                <CardContent className="space-y-2">
                  <FormField
                    control={ProviderSignupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Name"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={ProviderSignupForm.control}
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
                    control={ProviderSignupForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">Mobile</FormLabel>
                        <FormControl>
                          <Input
                            id="mobile"
                            placeholder="Mobile"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ProviderSignupForm.control}
                    name="serviceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">
                          Offline Duration (in Hrs)
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select A Service" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-100">
                              {options?.map((service: any) => (
                                <SelectItem
                                  key={service.id}
                                  value={service.serviceName}
                                >
                                  {service.serviceName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ProviderSignupForm.control}
                    name="offlineDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">
                          Offline Duration (in Hrs)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="number"
                            placeholder="1.5"
                            className="text-slate-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={ProviderSignupForm.control}
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

                  <div className="space-y-1 pt-4">
                    <>
                      {isGPSLoading ? (
                        <Loader className="col-span-1 m-auto flex animate-spin items-center justify-center" />
                      ) : (
                        <>
                          <Label className="pb-2 font-medium">
                            Location :{" "}
                          </Label>

                          <div className="outline-dotted">
                            <Button
                              className="flex gap-2 border-brand-verified text-brand-verified hover:text-brand-verified"
                              variant={"secondary"}
                              onClick={handleLocationClick}
                              type="button"
                            >
                              <LocateFixed size={32} />
                              <span>Detect your location automatically</span>
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="mx-auto" type="submit">
                    {mutation?.isPending ? "Creating Account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}

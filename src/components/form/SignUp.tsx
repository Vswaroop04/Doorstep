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
import {
  Loader,
  LocateFixed,
  LocateFixedIcon,
  LocateIcon,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { SlotPopup } from "../Provider/SlotsPopup";
import { CardDetailsPopup } from "../user/CardDetailsPopup";

export default function SignUpComponent() {
  const router = useRouter();
  const UserSignUpForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });
  const ProviderSignupForm = useForm<z.infer<typeof providerFormSchema>>({
    resolver: zodResolver(providerFormSchema),
  });

  function UserSignUp (values: z.infer<typeof userFormSchema>) {
    if ("geolocation" in window.navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          setLocation({ lat, long });
        } catch (e) {
          console.error("Error retrieving geolocation:", e);
        }
      });
    } else {
      console.error("Geolocation not supported");
      setIsGPSLoading(false);
    }
    toast.info("Creating Account ...", { id: "loading", duration: 500 });

    mutation.mutate({
      lat: location?.lat || 0,
      long: location?.long || 0,
      ...cardDetails,
      ...values,
    });
    toast.dismiss("loading");
  }
  function ProviderSignUp(values: z.infer<typeof providerFormSchema>) {
    toast.info("Creating Account ..", { id: "loading", duration: 500 });
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
        setAutoLoc(true);
      });
    } else {
      console.error("Geolocation not supported");
    }
    providerMutation.mutate({
      lat: location.lat || 0,
      long: location.long || 0,
      slots: selectedSlots,
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
  const [cardDetails, setcardDetails] = useState<{
    cardDetails?: string;
    expiryDate?: string;
    cvc?: string;
    nameOnCard?: string;
  }>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setcardDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("user");
  const [isGPSLoading, setIsGPSLoading] = useState(false);
  const [autoLoc, setAutoLoc] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [cardDetailsPopup, setCardDetailsPopup] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat?: number; long?: number }>({
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
        setAutoLoc(true);
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
                        <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel htmlFor="email">Email <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel htmlFor="mobile">Mobile  <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel htmlFor="password">Password <span className="text-red-500">*</span> </FormLabel>
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
            
    <FormItem>
      <FormControl>
    
      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Card Number 
            </label>
            <input
              id="cardDetails"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardDetails.cardDetails || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Expiry Date 
              </label>
              <input
                id="expiryDate"
                className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiryDate || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                CVC 
              </label>
              <input
                id="cvc"
                className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                type="text"
                placeholder="CVC"
                value={cardDetails.cvc || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Name on Card 
            </label>
            <input
              id="nameOnCard"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
              type="text"
              placeholder="John Doe"
              value={cardDetails.nameOnCard || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </FormControl>
      <p className="text-gray-500 mt-4 text-xs flex items-center ">
        * These details will be used for further payments.
      </p>
      <FormMessage />
    </FormItem>
   
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
                    Please Sign Up as a provider 
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-700">
                      Already have an Account ? {""}
                    </span>
                    <Link href="/sign-in" className="underline text-blue-500">
                      {mutation?.isPending ? "Creating Account..." : "Sign In"}
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
                        <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
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
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">Mobile <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel htmlFor="mobile">Service <span className="text-red-500">*</span></FormLabel>
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
                    name="onlinePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">
                        Online Session Fee (in $/Hr) <span className="text-red-500">*</span>
                          <p className="text-gray-500  text-xs flex items-center ">
        This Price will be used for online meetings and will be visible to clients
      </p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="number"
                            placeholder="10 $"
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
                    name="offlinePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="mobile">
                          Offline Session Fee (in $/Hr) <span className="text-red-500">*</span>
                          <p className="text-gray-500  text-xs flex items-center ">
        This Price will be used for offline meetings and will be visible to clients once you scheduke offline meetings
      </p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="number"
                            placeholder="15 $"
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
                        <FormLabel htmlFor="email">Email <span className="text-red-500">*</span></FormLabel>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Slots <span className="text-red-500">*</span>             <p className="text-gray-500  text-xs flex items-center ">
        Please Schedule Your Online Meeting Slots According To Your Availability
      </p> </FormLabel>
                        <FormControl>
                          <Button
                            type="button"
                            className="flex hover:flex-1 border items-center "
                            variant={"ghost"}
                            onClick={() => setOpen(true)}
                          >
                            Select Slots
                          </Button>
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
                        <FormLabel htmlFor="password">Password <span className="text-red-500">*</span></FormLabel>
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
                  <Button variant="outline" className="mx-auto" type="submit">
                    {mutation?.isPending ? "Creating Account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
      {open && (
        <SlotPopup
          open={open}
          setOpen={setOpen}
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />
      )}
      {cardDetailsPopup && (
        <CardDetailsPopup
          open={cardDetailsPopup}
          setOpen={setCardDetailsPopup}
          cardDetails={cardDetails}
          setCardDetails={setcardDetails}
        />
      )}
    </MaxWidthWrapper>
  );
}

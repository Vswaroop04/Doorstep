"use client";
import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const BookAServiceButton = () => {
  const { auth } = useAuth();
  console.log(auth);
  const router = useRouter();

  return (
    <div>
      {" "}
      <Button
        variant={"outline"}
        onClick={() => {
          if (auth?.user) {
            router.push("/services");
          } else {
            if (auth?.provider) {
              router.push("/services");
            }
            router.push("/sign-in");
          }
        }}
      >
        {" "}
        Book a Service &rarr;{" "}
      </Button>
    </div>
  );
};

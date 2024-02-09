import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import {  Axe, Paintbrush2, Plug, Wrench } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Plumber",
    Icon: Wrench,
    description:
      "Our plumbing services guarantee hassle-free solutions to your plumbing issues. From fixing leaks to installing new fixtures, we've got you covered.",
  },
  {
    name: "Electrical",
    Icon: Plug,
    description:
      "Our electrical services ensure safety and reliability. With our expert team, rest assured that your electrical needs will be met with precision and efficiency.",
  },
  {
    name: "Carpentry",
    Icon: Axe,
    description:
      "Experience the craftsmanship of our carpentry services. From custom furniture to home renovations, we bring your vision to life with meticulous attention to detail.",
  },
  {
    name: "Painting",
    Icon: Paintbrush2,
    description:
      "Transform your space with our professional painting services. Whether it's interior or exterior, our skilled painters deliver flawless finishes and stunning results.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Our goal is to simplify our customers lives by leveraging these {""}
            <span className="text-blue-600">principles</span>
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to DoorStep. We deliver seamless experiences through
            streamlined operations and enhanced decision-making
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              {" "}
              Browse Services
            </Link>
            <Button variant={"ghost"}> Book a Service &rarr; </Button>
          </div>
        </div>
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50 py-4 ">
        <p className="text-xl text-center flex flex-col items-center">
          {" "}
          Our Services{" "}
        </p>
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 gap-y-12 sm:gap-x-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center lg:my-10"
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
    </>
  );
}

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PreFooter from "@/components/PreFooter";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { perks } from "@/components/Perks";
import useAuth from "@/hooks/useAuth";
import { BookAServiceButton } from "@/components/home/BookAServiceButton";

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
            <Link href="/services" className={buttonVariants()}>
              {" "}
              Browse Services
            </Link>
            <BookAServiceButton />
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
            {perks.slice(0, 4).map((perk) => (
              <div
                key={perk.name}
                className="cursor-pointer text-center md:flex md:items-start md:text-left lg:block lg:text-center lg:my-10"
              >
                <Link href={perk.href}>
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
                </Link>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
      <PreFooter />
    </>
  );
}

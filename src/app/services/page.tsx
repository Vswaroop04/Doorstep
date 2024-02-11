"use client"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import { useRouter } from "next/navigation";
import { perks } from "@/components/Perks";

const Services = () => {
  const router = useRouter();
  return (
    <div>
      {" "}
      <section className="border-t border-gray-200 bg-gray-50 py-4 ">
        <p className="text-xl text-center flex flex-col items-center">
          {" "}
          Services{" "}
        </p>
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
  );
};

export default Services;

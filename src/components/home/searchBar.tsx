"use client";
import { Input } from "@/components/ui/input";

export const searchBar = () => {
  return (
    <div>
      {" "}
      <div className="ml-auto  flex justify-center items-center">
        <Input type="service" placeholder="Search For A Service" />
      </div>
    </div>
  );
};

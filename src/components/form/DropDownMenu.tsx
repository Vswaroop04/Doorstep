import { getAllServices } from "@/lib/fetchers/getAllServices";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

export default function DropdownMenu() {
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
    <div className="space-y-1">
      <Label htmlFor="username">Service Name</Label>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select A Service" />
        </SelectTrigger>
        <SelectContent className="bg-slate-100">
          {options?.map((service: any) => (
            <SelectItem key={service.id} value={service.serviceName}>
              {service.serviceName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

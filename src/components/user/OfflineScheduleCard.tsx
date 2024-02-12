import { AvatarIcon, ChevronDownIcon, MobileIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MailIcon } from "lucide-react";

export function OfflineMeetingCard({
  providerName,
  serviceName,
  providerEmail,
  providerMobile,
  offlineSlotTime,
  offlineDuration,
  date,
}: {
  providerName?: string;
  serviceName?: string;
  providerEmail?: string;
  providerMobile?: number;
  offlineSlotTime?: string;
  offlineDuration?: number;
  date?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-row items-center ">
             <CardTitle>{date}</CardTitle>
            <h1 className="text-2xl font-bold">{providerName}</h1>
          </div>
          <div>
            <div>{offlineSlotTime}</div>
            <div>{offlineDuration} Hr(s)</div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <CardDescription>{serviceName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="rounded-lg pt-2">
              <MailIcon />
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                {providerEmail || "NA"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="rounded-lg pt-2">
              <MobileIcon className="w-6 h-6" />
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                {providerMobile || "NA"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

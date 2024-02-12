import { AvatarIcon, ChevronDownIcon, MobileIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailIcon } from "lucide-react";

export function MeetingCard({
  providerName,
  serviceName,
  providerEmail,
  providerMobile,
  date,
  slotStatus,
  slotTime,
  slotDuration,
}: {
  providerName?: string;
  serviceName?: string;
  providerEmail?: string;
  providerMobile?: number;
  date?: string;
  slotStatus?: string;
  slotTime?: string;
  slotDuration?: number;
}) {
  return (
    <Card className="border border-gray-200 rounded-lg shadow-md">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <div className=" flex-row items-center">
            <CardTitle className="text-lg font-semibold">{date}</CardTitle>
            <h1 className="text-2xl font-bold">{providerName}</h1>
          </div>
          <div>
            <div>{slotTime}</div>
            <div>{slotDuration} Hr(s)</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardDescription className="text-gray-500">
              {serviceName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 py-4">
        <div className="flex items-center space-x-4">
          <Avatar className="rounded-lg pt-2">
            <MailIcon />
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">{providerEmail || "NA"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="rounded-lg pt-2">
            <MobileIcon className="w-6 h-6" />
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">{providerMobile || "NA"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">Slot Status:</p>
          <p
            className={`text-sm ${
              slotStatus === "Booked"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }`}
          >
            {slotStatus}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">Slot Time:</p>
          <p className="text-sm">{slotTime}</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">Slot Duration:</p>
          <p className="text-sm">{slotDuration} Hr(s)</p>
        </div>
      </CardContent>
    </Card>
  );
}

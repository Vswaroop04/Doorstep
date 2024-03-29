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
import { OfflineSchedule } from "@/lib/types/authType";
import OfflineSchedulesUser from "./OfflineScheduleWithAvatar";

export function OfflineMeetingCard({
  offlineSchedules,
}: {
  offlineSchedules?: OfflineSchedule[];
}) {
  console.log(offlineSchedules);
  return (
    <div>
      <Card className="">
        <CardHeader>
          <CardDescription className="flex justify-center mx-auto">
            Here is the list of offline schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offlineSchedules?.map(
            (ofsc) =>
              ofsc.status != null && (
                <OfflineSchedulesUser
                  key={ofsc.id}
                  providerId={ofsc.providerId}
                  providerEmail={ofsc.provider?.email || ""}
                  providerName={ofsc?.provider?.name || ""}
                  providerMobile={ofsc?.provider?.mobile || 0}
                  offlinsSlotTime={ofsc.offlineSlotTime}
                  offlineSlotDuration={ofsc.offlineSlotDuration || 0}
                  date={ofsc.date}
                  status={ofsc.status}
                  price={ofsc.provider?.offlinePrice}
                />
              )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

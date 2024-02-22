import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scheduleOfflineMeeting } from "@/lib/fetchers/scheduleOfflineMeeting";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function ScheduleOffDurDialog({
  open,
  setOpen,
  name,
  email,
  userId,
  offlineSlotTime: initialOfflineSlotTime,
  offlineSlotDuration: initialOfflineSlotDuration,
  priority: initialPriority,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  email: string;
  userId: string;
  offlineSlotTime: string;
  offlineSlotDuration: string;
  priority: number;
}) {
  const router = useRouter();
  const [newOfflineSlotTime, setOfflineSlotTime] = useState(
    initialOfflineSlotTime
  );
  const [newOfflineSlotDuration, setOfflineSlotDuration] = useState(
    initialOfflineSlotDuration
  );
  const [priority, setPriority] = useState(initialPriority);

  async function submitOfflineDuration() {
    try {
      const todayDate = new Date().toISOString().split("T")[0];

      toast.info("Creating New Offline Schedule");
      const offlineSchedule = await scheduleOfflineMeeting({
        date: todayDate,
        userId,
        offlineSlotTime: newOfflineSlotDuration,
        offlineSlotDuration: newOfflineSlotDuration,
        priority,
      });
      setOpen(false);
      toast.success("Offline Schedule Created Succesfully");
      setTimeout(() => {
        router.push("/provider/dashboard");
      }, 1000);
    } catch (e) {
      console.log(e);
      toast.error("An error occurred while saving changes");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100 p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Schedule Offline Meeting
          </DialogTitle>
          <div className="text-lg text-slate-600">
            <div>{name}</div>
            <div>{email}</div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="block">Offline Slot Time</Label>
            <Input
              type="text"
              value={newOfflineSlotTime}
              onChange={(e) => setOfflineSlotTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="block">Offline Slot Duration (in Hrs)</Label>
            <Input
              type="text"
              value={newOfflineSlotDuration}
              onChange={(e) => setOfflineSlotDuration(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="block">Priority</Label>
            <Input
              type="number"
              value={priority.toString()}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end">
          <Button
            type="submit"
            onClick={() => submitOfflineDuration()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

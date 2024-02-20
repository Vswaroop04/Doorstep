import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuth from "@/hooks/useAuth";
import { RequestMeeting } from "@/lib/fetchers/requestMeeting";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function RequestSlot({
  open,
  setOpen,
  slot,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  slot: any;
}) {
  const router = useRouter();
  const { auth } = useAuth();
  if (!auth?.user) {
    toast.message("Please Login As User");
    setTimeout(() => {
      router.push("/sign-in");
    }, 1000);
    return (
      <div className="relative">
        <div className="absolute left-1/2">
          Please Login As A User to Continue
        </div>
      </div>
    );
  }
  async function requestMeeting() {
    try {
      toast.info("Requesting Meeting");
      const response = await RequestMeeting(slot.id);
      setOpen(false);
      toast.success(response.message);
    } catch (e) {
      console.log(e)
      toast.error("Error Occurred" );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl">Slot Details</DialogTitle>
          <DialogDescription>
            Based on this offline duration, we will give you recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Date</div>
            <div className="text-gray-700">{slot.date}</div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Time</div>
            <div className="text-gray-700">{slot.slotTime}</div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Duration</div>
            <div className="text-gray-700">{slot.slotDuration} hour(s)</div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Current Status</div>
            <div className="text-gray-700 capitalize">{slot.slotStatus}</div>
          </div>
        </div>

        <DialogFooter className="flex">
          <Button
            type="submit"
            variant={"outline"}
            onClick={() => requestMeeting()}
          >
            Request Online Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

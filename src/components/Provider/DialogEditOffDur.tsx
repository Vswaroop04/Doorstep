"use client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editOfflineDuration } from "@/lib/fetchers/editOfflineDuration";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function EditOffDuration({
  open,
  setOpen,
  offlineDuration,
  setOfflineDuration,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  offlineDuration: number;
  setOfflineDuration: Dispatch<SetStateAction<number>>;
}) {
  const [newOfflineDuration, setNewOfflineDuration] = useState<number>(1);

  const handleOfflineDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    setNewOfflineDuration(isNaN(value) ? 0 : value);
  };

  async function submitOfflineDuration() {
    try {
      toast.info("Saving Offline Duration");
      await editOfflineDuration(newOfflineDuration);
      setOfflineDuration(newOfflineDuration);
      setOpen(false);
      toast.success("Offline Duration Changed Succesfully");
    } catch (e) {
      console.log(e);
      toast.error("Error Occured");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Edit Offline Slot Duration</DialogTitle>
          <DialogDescription>
            Based On this offline Duration We will give you recommendations
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 py-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="number" className="text-nowrap text-base">
              Offline Duration
            </Label>
            <Input
              id="number"
              type="number"
              className="flex-1"
              value={newOfflineDuration}
              onChange={handleOfflineDurationChange}
            />
            <span className="ml-2">Hrs</span>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => submitOfflineDuration()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

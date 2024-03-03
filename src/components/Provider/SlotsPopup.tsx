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
import React, { Dispatch, SetStateAction, useState } from "react";

export function SlotPopup({
  open,
  setOpen,
  selectedSlots,
  setSelectedSlots,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSlots: number[];
  setSelectedSlots: Dispatch<SetStateAction<number[]>>;
}) {
  const handleSlotClick = (slot: number) => {
    const index = selectedSlots.indexOf(slot);
    if (index === -1) {
      setSelectedSlots([...selectedSlots, slot]);
    } else {
      const updatedSlots = [...selectedSlots];
      updatedSlots.splice(index, 1);
      setSelectedSlots(updatedSlots);
    }
  };

  const isSlotSelected = (slot: number) => selectedSlots.includes(slot);

  const generateSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let i = startHour; i < endHour; i++) {
      slots.push(i);
    }
    return slots;
  };

  const slots = generateSlots(8, 20);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Your Slots</DialogTitle>
          <DialogDescription>
            Please Select/Edit the slots for your online Meetings
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 ">
          {slots.map((slot) => (
            <div
              key={slot}
              className={`p-2 m-2 text-center border cursor-pointer ${
                isSlotSelected(slot) ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleSlotClick(slot)}
            >
              {slot}-{slot + 1}
            </div>
          ))}
        </div>

        <DialogFooter className="flex">
          <Button
            type="submit"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

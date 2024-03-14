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
import { editSlots } from "@/lib/fetchers/editSlots";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function EditSlotPopup({
  open,
  setOpen,
  selectedSlots,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSlots: number[];
}) {
  const router = useRouter();
  const [slotsSelected, setSelectedSlots] = useState(selectedSlots);
  const handleSlotClick = (slot: number) => {
    const index = slotsSelected.indexOf(slot);
    if (index === -1) {
      setShowWarning(false);
      setSelectedSlots([...slotsSelected, slot]);
    } else {
      setShowWarning(true);
      const updatedSlots = [...slotsSelected];
      updatedSlots.splice(index, 1);
      setSelectedSlots(updatedSlots);
    }
  };
  const [warning, setShowWarning] = useState(false);

  const isSlotSelected = (slot: number) => slotsSelected.includes(slot);

  const generateSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let i = startHour; i < endHour; i++) {
      slots.push(i);
    }
    return slots;
  };
  async function saveSlots() {
    try {
      toast.info("Saving Slots");
      await editSlots(slotsSelected);
      toast.success("Slots Saved Succesfully");
      window.location.reload();
    } catch (e) {
      console.log(e);
      toast.error("Error Occured");
    }
  }
  const isSlotCompleted = (slot: number) => {
    if (slot < new Date().getHours()) {
      return true;
    }
    return false;
  };

  const slots = generateSlots(1, 23);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Your Slots</DialogTitle>
          <DialogDescription>
            Please Edit the slots for your online Meetings
          </DialogDescription>
        </DialogHeader>
        {warning && (
          <div className="text-red-400">
            *If this slot has active meetings On Save Will Delete the current
            Meetings Of the Slot{" "}
          </div>
        )}
        <div className="grid grid-cols-4 ">
          {slots.map((slot) => (
            <Button
              key={slot}
              variant={"secondary"}
              disabled={isSlotCompleted(slot)}
              className={`p-2 m-2 text-center border cursor-pointer ${
                isSlotSelected(slot)
                  ? "bg-green-500 hover:bg-green-300 text-white"
                  : ""
              }`}
              onClick={() => handleSlotClick(slot)}
            >
              {slot}-{slot + 1}
            </Button>
          ))}
        </div>

        <DialogFooter className="flex">
          <Button type="submit" variant={"outline"} onClick={() => saveSlots()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { leaveFeedback } from "@/lib/fetchers/userFeedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardDetailsPopup({
  open,
  setOpen,
  cardDetails,
  setCardDetails,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cardDetails: {
    cardDetails?: string;
    expiryDate?: string;
    cvc?: string;
    nameOnCard?: string;
  };
  setCardDetails: Dispatch<
    SetStateAction<{
      cardDetails?: string;
      expiryDate?: string;
      cvc?: string;
      nameOnCard?: string;
    }>
  >;
}) {
  // Handler for updating card details
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };
  const handleSubmit = () => {
    // Validation
    if (!cardDetails.cardDetails || !/^\d{16}$/.test(cardDetails.cardDetails)) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    if (
      !cardDetails.expiryDate ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)
    ) {
      toast.error("Please enter a valid expiry date in MM/YY format");
      return;
    }
    if (!cardDetails.cvc || !/^\d{3}$/.test(cardDetails.cvc)) {
      toast.error("Please enter a valid 3-digit CVC");
      return;
    }

    // All validations passed, submit the card details
    // leaveFeedback(cardDetails); // Example submission function
    setOpen(false); // Close the dialog after submission
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
          <DialogDescription>
            Please provide your card details:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              id="cardDetails"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardDetails.cardDetails || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                id="expiryDate"
                className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiryDate || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                CVC <span className="text-red-500">*</span>
              </label>
              <input
                id="cvc"
                className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                type="text"
                placeholder="CVC"
                value={cardDetails.cvc || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Name on Card <span className="text-red-500">*</span>
            </label>
            <input
              id="nameOnCard"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
              type="text"
              placeholder="John Doe"
              value={cardDetails.nameOnCard || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

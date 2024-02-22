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

export function Feedback({
  open,
  setOpen,
  providerId,
  feedback,
  setFeedback,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  providerId: string;
  feedback: { success: boolean };
  setFeedback: Dispatch<SetStateAction<{ success: boolean }>>;
}) {
  const [ratings, setRatings] = useState({
    punctuality: 0,
    professionalism: 0,
    problemResolution: 0,
    efficiency: 0,
    cleanliness: 0,
    responseTime: 0,
    resolutionTime: 0,
  });

  const handleRatingChange = (ratingName: string, newValue: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [ratingName]: newValue,
    }));
  };

  const handleSubmitFeedback = async (e: any) => {
    e.preventDefault();

    try {
      toast.info("Submitting Feedback");
      const feedbackData = {
        providerId,
        ...ratings,
      };

      const response = await leaveFeedback(feedbackData);
      setFeedback({ success: true });
      setOpen(false);
      toast.success("Feedback Submitted Successfully");
    } catch (e) {
      console.error(e);
      toast.error("Error Occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            Please rate the following aspects of the service provider:
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitFeedback}>
          <div className="flex flex-col gap-4 py-4">
            <RatingInput
              label="Punctuality"
              ratingName="punctuality"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Professionalism"
              ratingName="professionalism"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Problem Resolution"
              ratingName="problemResolution"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Efficiency"
              ratingName="efficiency"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Cleanliness"
              ratingName="cleanliness"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Response Time"
              ratingName="responseTime"
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Resolution Time"
              ratingName="resolutionTime"
              onChange={handleRatingChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RatingInputProps {
  label: string;
  ratingName: string;
  onChange: (ratingName: string, value: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({
  label,
  ratingName,
  onChange,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (e: any) => {
    const newValue = parseInt(e.target.value);
    if (newValue > 10) {
      toast.error("Please enter a valid rating below 10.");
      setValue(10);
      return;
    }
    setValue(newValue);
    onChange(ratingName, newValue);
  };

  return (
    <div className="flex items-center justify-between mx-0 gap-2">
      <Label htmlFor={ratingName} className="fixed ">
        {label}
      </Label>
      <Input
        id={ratingName}
        type="number"
        value={value}
        onChange={handleChange}
        step="0.1" // Allow decimals
        className="w-1/3  ml-36 appearance-none"
        style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
        max={10}
      />
    </div>
  );
};

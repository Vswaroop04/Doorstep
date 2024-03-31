import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { Feedback } from "./FeedBackDialog";
import { feedbackExists } from "@/lib/fetchers/feedbackExists";

export default function OfflineSchedulesUser({
  providerId,
  providerEmail,
  providerName,
  providerMobile,
  offlinsSlotTime,
  offlineSlotDuration,
  date,
  status,
  price,
}: {
  providerId: string;
  providerEmail: string;
  providerName: string;
  providerMobile: number;
  offlinsSlotTime: string;
  offlineSlotDuration: number;
  date: string;
  status: string;
  price?: number;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState({ success: false });

  useEffect(() => {
    const fetchFeedback = async () => {
      const response = await feedbackExists({ providerId });
      setFeedback(response);
    };
    fetchFeedback();
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-md">
      {/* Provider details with avatar */}
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12 rounded-full mr-4">
              <AvatarImage src="/avatars/02.png" alt="Avatar" />
              <AvatarFallback>
                <Calendar className="text-gray-300" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-base font-semibold leading-tight mb-1">
              {providerName}
            </p>
            <p className="text-sm text-gray-500">{providerEmail}</p>
            <p className="text-sm text-gray-500">{providerMobile}</p>
          </div>
        </div>
        {feedback && feedback.success && (
          <div>
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-600 font-semibold text-sm">
              {" "}
              Feedback Submitted !
            </span>
          </div>
        )}
        <div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel className="mb-2">Actions</DropdownMenuLabel>
                <div>
                  <Link
                    href={`/provider/${providerId}`}
                    className="text-sm p-4 pt-6"
                  >
                    View Provider
                  </Link>
                </div>
                {!feedback ||
                  (!feedback.success && (
                    <Button
                      className="font-normal"
                      onClick={() => setOpen(true)}
                    >
                      Leave a feedback
                    </Button>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Date and slot details */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Offline Slot Id:
          </p>
          <p className="text-sm text-gray-500">{providerId}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Date:</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Offline Slot Time:
          </p>
          <p className="text-sm text-gray-500">{offlinsSlotTime}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Offline Slot Duration:
          </p>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-600 font-semibold text-xs">
            {offlineSlotDuration} hour(s)
          </span>
        </div>
      </div>
      {status == "Completed" && (
        <div className="flex justify-end">
          <div className="flex justify-end">
            <button
              onClick={() => {
                window.location.href = `/pay?price=${price}`;
              }}
              className="bg-green-500 text-white rounded-full py-2 px-4 mr-2 hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Pay Now
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-500 text-white rounded-full py-2 px-4 mr-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Leave Feedback
            </button>
          </div>
        </div>
      )}

      <Feedback
        open={open}
        setOpen={setOpen}
        providerId={providerId}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    </div>
  );
}

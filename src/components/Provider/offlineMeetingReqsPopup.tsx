import { MailIcon } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { MobileIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Meeting, OfflineSchedule } from "@/lib/types/authType";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApproveMeeting } from "@/lib/fetchers/approveMeeting";
import { RejectMeeting } from "@/lib/fetchers/rejectMeeting";
import { Dispatch, SetStateAction, useState } from "react";
import { offlineMeetingReq } from "@/lib/fetchers/OfflineMeetingReq";

export async function OfflineMeetingPopup({
  open,
  setOpen,
  meetings,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetings?: OfflineSchedule[];
}) {
  console.log(meetings);
  const [Umeetings, setUMeetings] = useState(meetings);
  const [offlinePrices, setOfflinePrices] = useState<{ [key: string]: number }>(
    {}
  );

  async function sendReq(userId: string, offlinePrice: number) {
    try {
      toast.info("Sending Req");
      await offlineMeetingReq(userId, offlinePrice);
      toast.success(" Request Sent Successfully");
      setUMeetings((prevMeetings: any) =>
        prevMeetings.map((meeting: any) =>
          meeting.userId === userId
            ? { ...meeting, status: "requested" }
            : meeting
        )
      );
    } catch (error) {
      toast.error("Error: Try Again");
    }
  }

  const handlePriceChange = (userId: string, price: number) => {
    setOfflinePrices((prevPrices) => ({ ...prevPrices, [userId]: price }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-100 ">
        <DialogHeader>
          <DialogTitle className="font-xl text-black">
            Offline Req Details
          </DialogTitle>
          <DialogDescription>
            You Can Send Offline Scheduling Requests
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>A list of your recent online meetings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead> Offline Price (in $/Hr)</TableHead>

              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Umeetings?.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">
                  {meeting?.user?.name}
                </TableCell>
                <TableCell className="w-20 break-words">
                  {meeting?.user?.email}
                </TableCell>{" "}
                {/* Set maximum width and allow wrapping */}
                <TableCell>{meeting?.user?.mobile}</TableCell>
                <TableCell>
                  {meeting.status === "Approved" ||
                  meeting.status === "requested" ? (
                    <span>
                      {offlinePrices[meeting.userId] || meeting?.offlinePrice}
                    </span>
                  ) : (
                    <OfflinePriceInput
                      userId={meeting.userId}
                      price={offlinePrices[meeting.userId]}
                      onPriceChange={handlePriceChange}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {meeting.status === "requested" ? (
                    <div className="border-green-500 text-green-500 p-1">
                      Requested
                    </div>
                  ) : meeting.status === "Rejected" ? (
                    <>
                      <div className="border-red-500 text-red-500 p-1">
                        Rejected
                      </div>
                      <Button
                        onClick={() =>
                          sendReq(meeting.userId, offlinePrices[meeting.userId])
                        }
                        className="bg-green-500 text-white px-2 py-1 hover:bg-green-300 rounded mr-2"
                      >
                        Request Again
                      </Button>
                    </>
                  ) : meeting.status === "Approved" ? (
                    <div className="border-green-500 text-green-500 p-1">
                      Approved
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() =>
                          sendReq(meeting.userId, offlinePrices[meeting.userId])
                        }
                        className="bg-green-500 text-white px-2 py-1 hover:bg-green-300 rounded mr-2"
                      >
                        Request
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OfflinePriceInput({
  userId,
  price,
  onPriceChange,
}: {
  userId: string;
  price: number;
  onPriceChange: (userId: string, price: number) => void;
}) {
  return (
    <input
      type="number"
      placeholder="Offline Price"
      value={price}
      onChange={(e) => onPriceChange(userId, parseInt(e.target.value))}
      className="h-10 w-24 rounded-md border border-input bg-background" // Adjusted width
    />
  );
}

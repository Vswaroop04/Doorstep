import { MailIcon } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { MobileIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Meeting } from "@/lib/types/authType";
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
import { useState } from "react";

export async function SlotsCard({
  date,
  slotStatus,
  slotTime,
  slotDuration,
  meetings,
}: {
  date?: string;
  slotStatus?: string;
  slotTime?: string;
  slotDuration?: number;
  meetings?: Meeting[];
}) {
  const [Umeetings, setUMeetings] = useState(meetings);
  async function acceptRequest(meetingId: string, slotId: string) {
    try {
      toast.info("Approving Req");
      await ApproveMeeting(meetingId, slotId);
      toast.success("Approved Request Successfully");
      setUMeetings((prevMeetings: any) =>
        prevMeetings.map((meeting: any) =>
          meeting.id === meetingId
            ? { ...meeting, status: "scheduled" }
            : meeting
        )
      );
    } catch (error) {
      toast.error("Error: Try Again");
    }
  }

  async function rejectRequest(meetingId: string, slotId: string) {
    try {
      toast.info("Rejecting Req");

      await RejectMeeting(meetingId, slotId);
      toast.success("Rejected Request Successfully");
      setUMeetings((prevMeetings: any) =>
        prevMeetings.map((meeting: any) =>
          meeting.id === meetingId
            ? { ...meeting, status: "Rejected" }
            : meeting
        )
      );
    } catch (error) {
      toast.error("Error: Try Again");
    }
  }

  return (
    <Dialog>
      <Card className="border border-gray-200 rounded-lg shadow-md">
        <CardHeader className="px-6 py-4 bg-gray-100 border-b border-gray-200 rounded-t-lg hover:bg-slate-100">
          <div className="flex justify-between items-center ">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Date :</p>
                <p className="text-sm">{date}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Slot Time:</p>
                <p className="text-sm">{slotTime}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Slot Duration:</p>
                <p className="text-sm">{slotDuration} Hr(s)</p>
              </div>
            </div>
          </div>
          <CardDescription>
            {Umeetings && Umeetings.length > 0 ? null : (
              <span className="text-red-500">No Meetings As Of Now</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 max-w-lg">
          <div className="flex items-center space-x-4 justify-between">
            <div>
              {slotStatus === "scheduled" ? (
                <div className="outline border-red-500 text-red-500 p-1 rounded">
                  Scheduled
                </div>
              ) : (
                <div className="bg-green-500 text-white p-2 rounded">
                  {slotStatus}
                </div>
              )}
            </div>
            <div>
              <div className="relative cursor-pointer">
                <div className="outline-blue-400 p-2 pr-3">
                  {Umeetings && Umeetings.length > 0 && (
                    <DialogTrigger asChild>
                      <div className="text-gray-200  bg-blue-500 p-2 rounded">
                        Meetings
                      </div>
                    </DialogTrigger>
                  )}
                </div>
                {Umeetings && Umeetings.length > 0 && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                    {Umeetings.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="bg-slate-100 ">
        <DialogHeader>
          <DialogTitle className="font-xl text-black">
            Meeting Details
          </DialogTitle>
          <DialogDescription>
            You Can Accept Or Reject The Meeting Requests
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>A list of your recent meetings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Umeetings?.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">
                  {meeting?.user?.name}
                </TableCell>
                <TableCell>{meeting?.user?.email}</TableCell>
                <TableCell>{meeting?.user?.mobile}</TableCell>
                <TableCell className="text-right">
                  {meeting.status === ("scheduled" || "Scheduled") ? (
                    <div className="border-green-500 text-green-500 p-1">
                      Scheduled
                    </div>
                  ) : meeting.status === "Rejected" ? (
                    <div className="border-red-500 text-red-500 p-1">
                      Rejected
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() =>
                          acceptRequest(meeting.id, meeting.slotId)
                        }
                        className="bg-green-500 text-white px-2 py-1 hover:bg-green-300 rounded mr-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() =>
                          rejectRequest(meeting.id, meeting.slotId)
                        }
                        className="bg-red-500 text-white px-2 py-1 hover:bg-red-300 rounded"
                      >
                        Reject
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

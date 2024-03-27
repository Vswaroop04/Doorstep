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
import { ApproveOfflineMeeting } from "@/lib/fetchers/approveOfflineReqByUser";

export async function OfflineMeetingPopupUser({
  open,
  setOpen,
  meetings,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  meetings?: OfflineSchedule[];
}) {
  console.log(meetings);
  const [Umeetings, setUMeetings] = useState(meetings);
  async function sendReq(id: string, status: string) {
    try {
      toast.info("Sending Req");
      await ApproveOfflineMeeting(id, status);
      toast.success("Approved Request Successfully");
      setUMeetings((prevMeetings: any) =>
        prevMeetings.map((meeting: any) =>
          meeting.id === id ? { ...meeting, status } : meeting
        )
      );
    } catch (error) {
      toast.error("Error: Try Again");
    }
  }

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
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Umeetings?.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">
                  {meeting?.provider?.name}
                </TableCell>
                <TableCell>{meeting?.provider?.email}</TableCell>
                <TableCell>{meeting?.provider?.mobile}</TableCell>
                <TableCell className="text-right">
                  {meeting.status === "Approved" ? (
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
                        onClick={() => sendReq(meeting.id, "Approved")}
                        className="bg-green-500 text-white px-2 py-1 hover:bg-green-300 rounded mr-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => sendReq(meeting.id, "Rejected")}
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

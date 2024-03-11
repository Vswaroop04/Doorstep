import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  CalendarCheck2,
  CalendarIcon,
  Command,
  Edit,
  Edit2Icon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { EditOffDuration } from "./DialogEditOffDur";
import { OfflineSchedule } from "@/lib/types/authType";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { scheduleOfflineMeeting } from "@/lib/fetchers/scheduleOfflineMeeting";
import { toast } from "sonner";
import { updateOfscStatus } from "@/lib/fetchers/updateScheduleStatus";

export default function OfflineSlots({
  offlineDur,
  filteredOfsc,
}: {
  offlineDur: number;
  filteredOfsc?: OfflineSchedule[];
}) {
  const [offlineDuration, setOfflineDuration] = useState<number>(offlineDur);
  const [openPopup, setOpenPopup] = useState(false);
  const [ofsc, setOfsc] = useState(filteredOfsc);
  useEffect(() => {
    if (ofsc) {
      const newOfsc = ofsc.map((schedule, index) => ({
        ...schedule,
        priority: index + 1,
        offlineSlotTime: timeOptions[index % timeOptions.length],
      }));
      setOfsc(newOfsc);
    }
  }, []);
  const handleSelect = (scheduleId: string) => {
    console.log("handle select");
    const updatedOfsc = ofsc?.map((schedule) => {
      if (schedule.id === scheduleId) {
        if (schedule.status === "Selected") {
          console.log("null");
          return { ...schedule, status: null };
        } else {
          return {
            ...schedule,
            status: "Selected",
            date: dateOptions[0],
            offlineSlotTime:
              timeOptions[ofsc?.indexOf(schedule) % timeOptions.length],
            offlineSlotDuration: durationOptions[0],
          };
        }
      }
      return schedule;
    }) as OfflineSchedule[] | undefined;
    setOfsc(updatedOfsc);
  };
  const updateScheduleStatus = async (id: string, status: string) => {
    try {
      toast.message("Updating Status");
      await updateOfscStatus({ id, status });
      toast.success("Status Saved Succesfully");
    } catch (e) {
      console.log(e);
      toast.error("Error Occured");
    }
  };
  const saveOfscsInDB = async () => {
    try {
      toast.message("Saving Offline Schedules");
      if (ofsc) {
        for (const schedules of ofsc) {
          const { user, createdAt, updatedAt, ...schedule } = schedules;
          await scheduleOfflineMeeting(schedule);
        }
      }
      toast.success("Saved Succesfully");
    } catch (e) {
      console.log(e);
      toast.error("Error Occured");
    }
  };

  const updateSchedule = (
    scheduleId: string,
    updatedFields: Partial<OfflineSchedule>
  ) => {
    setOfsc((prevOfsc) =>
      prevOfsc?.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, ...updatedFields }
          : schedule
      )
    );
  };
  const timeOptions = Array.from(
    { length: 9 },
    (_, i) => (10 + i).toString().padStart(2, "0") + ":00"
  );

  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = formatDate(today);
  const nextDayFormatted = formatDate(nextDay);

  const dateOptions = [todayFormatted, nextDayFormatted];

  const durationOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5);

  const priorityOptions = Array.from(
    { length: (ofsc || []).length },
    (_, i) => i + 1
  );

  return (
    <div>
      {" "}
      <Sheet key={"right"}>
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight my-4 text-gray-800">
                Offline Schedules
              </h2>
            </div>
            <div>
              <SheetTrigger asChild>
                <button className="flex flex-col p-1 bg-green-200 hover:bg-green-300 text-green-800 font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out items-center space-x-2">
                  <CalendarCheck2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Schedule</span>
                  <span className="block text-xs text-green-600">
                    Offline Meeting
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side={"right"}>
                <div className="">
                  <SheetHeader>
                    <SheetTitle className="flex justify-center mx-auto text-xl">
                      <span className="ml-8">Schedule Offline Meeting</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex justify-between items-center mx-auto">
                      <h2 className="flex items-center whitespace-nowrap">
                        <span>Current Offline Duration :</span>
                        <span className="font-bold">{offlineDuration} hrs</span>
                        <span
                          className="ml-2 cursor-pointer"
                          onClick={() => {
                            setOpenPopup(true);
                          }}
                        >
                          <SheetClose asChild>
                            <Edit />
                          </SheetClose>
                        </span>
                      </h2>
                    </div>
                    <h1> </h1>
                    <div className="container mx-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2">Action</th>
                            <th className="px-4 py-2">User Name</th>
                            <th className="px-4 py-2">User Email</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Offline Slot Time</th>
                            <th className="px-4 py-2">Offline Slot Duration</th>
                            <th className="px-4 py-2">Priority</th>
                            <th className="px-4 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ofsc?.map(
                            (schedule) =>
                              !["Scheduled", "Completed", "Cancelled"].includes(
                                schedule.status
                              ) && (
                                <tr key={schedule.id}>
                                  <td className="px-4 py-2">
                                    <button
                                      className="focus:outline-none"
                                      onClick={() => handleSelect(schedule.id)}
                                    >
                                      {schedule.status === "selected" ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-green-500"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 20v-2m0 0v-2m0 2h2m-2 0H8m8-4a7 7 0 00-7-7V3a1 1 0 00-2 0v6a1 1 0 00.293.707l4 4a1 1 0 001.414 0l4-4A1 1 0 0018 9V3a1 1 0 00-2 0v6a1 1 0 00.293.707l-3.5 3.5a1 1 0 01-1.414 0L8.707 9.707A1 1 0 008 10V4a1 1 0 00-2 0v6a1 1 0 00.293.707l-4 4a1 1 0 001.414 1.414l3.5-3.5A1 1 0 018 14V20a7 7 0 007 0z"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-2">
                                    {schedule.user?.name}
                                  </td>
                                  <td className="px-4 py-2">
                                    {schedule.user?.email}
                                  </td>
                                  <td>
                                    {/* date dropdown */}
                                    <select
                                      defaultValue={schedule.date}
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, {
                                          date: e.target.value,
                                        })
                                      }
                                      className=" p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                      {dateOptions.map((date) => (
                                        <option
                                          key={date}
                                          value={date}
                                          className="p-4 border border-gray-300   "
                                        >
                                          {date}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    {/* Time dropdown */}
                                    <select
                                      defaultValue={schedule.offlineSlotTime}
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, {
                                          offlineSlotTime: e.target.value,
                                        })
                                      }
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                      {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    {/* Duration dropdown */}
                                    <select
                                      defaultValue={
                                        schedule.offlineSlotDuration
                                      }
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, {
                                          offlineSlotDuration: parseFloat(
                                            e.target.value
                                          ),
                                        })
                                      }
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                      {durationOptions.map((duration) => (
                                        <option
                                          key={duration}
                                          value={durationOptions[1]}
                                        >
                                          {duration}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    {/* Priority dropdown */}
                                    <select
                                      defaultValue={schedule.priority}
                                      onChange={(e) =>
                                        updateSchedule(schedule.id, {
                                          priority: parseInt(e.target.value),
                                        })
                                      }
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                      {priorityOptions.map((priority) => (
                                        <option key={priority} value={priority}>
                                          {priority}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-2">
                                    {schedule.status}
                                  </td>
                                </tr>
                              )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" onClick={() => saveOfscsInDB()}>
                        Save changes
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </SheetContent>
            </div>
          </div>
          <Table className="border my-4">
            <TableCaption>A list of your offline schedules.</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-300 hover:bg-slate-200">
                <TableHead>Offline Slot Date</TableHead>
                <TableHead>Offline Slot Time</TableHead>
                <TableHead>Offline Slot Duration (Hrs)</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>

                <TableHead className="text-center">Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ofsc?.map(
                (meeting) =>
                  meeting.status !== null && (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting?.date}</TableCell>
                      <TableCell>{meeting?.offlineSlotTime}</TableCell>
                      <TableCell>{meeting?.offlineSlotDuration}</TableCell>
                      <TableCell className="font-medium">
                        {meeting?.user?.name}
                      </TableCell>
                      <TableCell>{meeting?.user?.email}</TableCell>
                      <TableCell>{meeting?.user?.mobile}</TableCell>
                      <TableCell>{meeting?.priority}</TableCell>
                      <TableCell>
                        <select
                          className={"w-[100px] p-2 font-normal border"}
                          value={meeting.status}
                          onChange={(e) =>
                            updateScheduleStatus(meeting.id, e.target.value)
                          }
                        >
                          {meeting.status === "Selected" ? (
                            <>
                              <option value="Selected">Selected</option>
                              <option value="Scheduled">Schedule</option>
                              <option value="Completed">Completed</option>
                            </>
                          ) : (
                            <>
                              {meeting.status === "Scheduled" ? (
                                <>
                                  <option value="Selected">-</option>
                                  <option value="Completed">Completed</option>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Completed">Completed</option>
                                </>
                              )}
                            </>
                          )}
                          {meeting.status !== "Selected" && (
                            <option value="system">Cancelled</option>
                          )}
                        </select>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </div>
      </Sheet>
      <EditOffDuration
        open={openPopup}
        setOpen={setOpenPopup}
        offlineDuration={offlineDuration}
        setOfflineDuration={setOfflineDuration}
      />
    </div>
  );
}

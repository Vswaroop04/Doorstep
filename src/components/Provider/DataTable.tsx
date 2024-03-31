"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OfflineSchedule, Slot } from "@/lib/types/authType";
import { ScheduleOffDurDialog } from "./DialogScheduleOfflineDur";

interface DataTableProps {
  slots: Slot[];
  offlineSchedules?: OfflineSchedule[];
  offlineDuration: number;
}
export type User = {
  id: string;
  name: string;
  email: string;
  mobile: number;
  priority: number;
  offlineSlotDuration: string;
  offlineSlotTime: string;
  offlineMeetingScheduled?: boolean;
};

const Cell = ({ row }: { row: any }) => {
  const User = row.original;
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="mr-4">
        {User?.offlineMeetingScheduled ? (
          <div className="text-red-600"> Scheduled </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Button variant={"destructive"} onClick={() => setOpen(true)}>
                Schedule Offline Meeting
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {open && (
        <ScheduleOffDurDialog
          open={open}
          setOpen={setOpen}
          email={User.email}
          name={User.name}
          offlineSlotDuration={User.offlineSlotDuration}
          offlineSlotTime={User.offlineSlotTime}
          priority={User.priority}
          userId={User.id}
        />
      )}
    </>
  );
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <Button variant="ghost">Name</Button>,
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <Button variant="ghost">Email</Button>,
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => <Button variant="ghost">Mobile</Button>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("mobile")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("priority")}</div>
    ),
  },
  {
    accessorKey: "offlineSlotTime",
    header: "Slot Time",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("offlineSlotTime")}</div>
    ),
  },
  {
    accessorKey: "offlineSlotDuration",
    header: "Slot Duration",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("offlineSlotDuration")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: Cell,
  },
];

const DataTableDemo: React.FC<DataTableProps> = ({
  slots,
  offlineSchedules,
  offlineDuration,
}: DataTableProps) => {
  const slotsWithMeetings = slots.filter(
    (slot) => slot?.meetings?.length ?? 0 > 0
  );

  let currentPriority = 1;
  let currentHour = 10;
  let count = 0;

  const data: User[] = slotsWithMeetings
    .map((slot) => {
      const user = slot?.meetings?.[0]?.user;
      if (count > offlineDuration) {
        return;
      }
      if (user) {
        const { id, name, email, mobile } = user;
        const userData: User = {
          id,
          name,
          email,
          mobile,
          priority: currentPriority,
          offlineSlotDuration: "1",
          offlineSlotTime: `${currentHour.toString().padStart(2, "0")}:00:00`,
        };

        currentPriority++;
        currentHour++;
        count++;

        return userData;
      }
      return undefined;
    })
    .filter(Boolean) as User[];

  data.forEach((user) => {
    user.offlineMeetingScheduled = offlineSchedules?.some(
      (ofsc) => ofsc.user?.id === user.id
    );
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      {" "}
      <div className="flex items-center justify-center pt-4 text-xl font-bold underline align-middle mx-auto">
        Offline Schedule Suggestion/s
      </div>
      <div className="flex items-center justify-center mx-auto pb-4 pt-2">
        We recommend using the following suggestions for your offline schedules,
        tailored to your slot times.{" "}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTableDemo;

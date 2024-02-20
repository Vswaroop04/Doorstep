"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
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
import { Provider } from "@/lib/fetchers/providerSignup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RequestSlot } from "../form/RequestSlot";

const Cell = ({ row }: { row: any }) => {
  const Provider = row.original;
  const [open, setOpen] = React.useState(false);
  const [slot, setSlot] = React.useState(false);

  const todayDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"} className="outline border-0 p-2">
            View Slots
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogTitle className="p-4 text-center">
            Slots of {Provider.name}
          </DialogTitle>
          <div> Date : {todayDate} </div>
          <div className="grid grid-cols-4 gap-6">
            {Provider.slots
              .filter((slot: any) => slot.date === todayDate)
              .sort((a: any, b: any) => a.slotTime.localeCompare(b.slotTime))
              .map((slot: any) => (
                <>
                  <Button
                    variant={"default"}
                    key={slot.id}
                    className={`border p-1 outline ${
                      currentTime > slot.slotTime ? "bg-red-50" : "bg-blue-100"
                    }`}
                    onClick={() => {
                      setSlot(slot);
                      setOpen(true);
                    }}
                    disabled={
                      currentTime > slot.slotTime || slot.status == "scheduled"
                    }
                  >
                    {slot.slotTime}
                  </Button>
                </>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      {open && <RequestSlot open={open} setOpen={setOpen} slot={slot} />}
    </>
  );
};
export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="text-center">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "serviceName",
    header: () => <div className="text-center">Service</div>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("serviceName")}</div>
    ),
  },
  {
    accessorKey: "averageRating",
    header: ({ column }) => {
      return (
        <div className="text-center">
          {" "}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg Rating
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const serviceName = row.getValue("averageRating");

      let formattedServiceName: number;

      if (serviceName === null) {
        formattedServiceName = 0;
      } else {
        formattedServiceName = Math.round(Number(serviceName) * 100) / 100;
      }

      return <div className="lowercase">{formattedServiceName}</div>;
    },
  },

  {
    id: "slots",
    enableHiding: false,
    cell: Cell,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const Provider = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white ">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(Provider.id)}
            >
              Book Appointment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Provider</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProvidersTable({
  providers,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
}: {
  providers: any;
  fetchNextPage: any;
  fetchPreviousPage: any;
  hasNextPage: boolean;
}) {
  console.log(providers);
  const [pageNum, setPageNum] = React.useState(0);
  const curretPage = providers.pages.length - 1;
  const firstPage = pageNum == 0 ? true : false;
  const data = providers?.pages[pageNum]?.providers;
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
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  console.log(table.getRowModel());
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNum(pageNum - 1)}
            disabled={firstPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchNextPage();
              setPageNum(pageNum + 1);
            }}
            disabled={!hasNextPage || table.getRowModel().rows?.length < 10}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

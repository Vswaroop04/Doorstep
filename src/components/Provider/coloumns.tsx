"use client";

import { ColumnDef } from "@tanstack/react-table";

export type User = {
  name: string;
  email: string;
  mobile: number;
  priority: number;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "priority",
    header: "riority",
  },
];

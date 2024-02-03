import {
  Users,
  Providers,
  Meetings,
  OfflineSchedules,
  Services,
  Slots,
} from "./schema";
import { db } from "@/lib/db";

export type TypeUser = typeof Users.$inferInsert;
export type TypeProvider = typeof Providers.$inferInsert;
export type TypeMeetings = typeof Meetings.$inferInsert;
export type TypeSlots = typeof Slots.$inferInsert;
export type TypeServices = typeof Services.$inferInsert;
export type TypeOfflineSchedules = typeof OfflineSchedules.$inferInsert;


export const insertNewUser = async (user: TypeUser) => {
  return await db.insert(Users).values(user).returning();
};

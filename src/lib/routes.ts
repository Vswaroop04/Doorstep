import { eq, sql } from "drizzle-orm";
import {
  Users,
  Providers,
  Meetings,
  OfflineSchedules,
  Services,
  Slots,
} from "./schema";
import { db } from "@/lib/db";
import { format } from "date-fns";

export type TypeUser = typeof Users.$inferInsert;
export type TypeProvider = typeof Providers.$inferInsert;
export type TypeMeetings = typeof Meetings.$inferInsert;
export type TypeSlots = typeof Slots.$inferInsert;
export type TypeServices = typeof Services.$inferInsert;
export type TypeOfflineSchedules = typeof OfflineSchedules.$inferInsert;

export const insertNewUser = async (user: TypeUser) => {
  return await db.insert(Users).values(user).returning();
};
export const insertNewProvider = async (provider: TypeProvider) => {
  const providerInsertOperation = db
    .insert(Providers)
    .values(provider)
    .returning();
  const slotTimes = [9, 10, 11, 13, 14, 15];
  const currentDate = format(new Date(), "yyyy-MM-dd");
  slotTimes.map((slotTime) =>
    db.insert(Slots).values({
      providerId: sql`${providerInsertOperation}.id`,
      date: currentDate,
      slotTime: `${slotTime}:00:00`,
      slotDuration: 1,
      slotStatus: "Active",
      createdAt: sql`NOW()`,
      updatedAt: sql`NOW()`,
    })
  );
  return providerInsertOperation;
};

export const scheduleMeetingWithProvider = async (
  slotId: number,
  userId: number
) => {
  return await db.insert(Meetings).values({
    slotId: slotId,
    userId: userId,
    status: "requested",
  });
};

export const approveMeetingWithCustomer = async (meetingId: number) => {
  return await db
    .update(Meetings)
    .set({ status: "scheduled" })
    .where(eq(Meetings.id, meetingId));
};

export const scheduleOfflineMeetingWithProvider = async (
  OfflineSchedule: TypeOfflineSchedules
) => {
  return await db.insert(OfflineSchedules).values(OfflineSchedule);
};

export const searchService = async (serviceName: string) => {
  return await db
    .select()
    .from(Services)
    .where(sql`${Services.serviceName} LIKE ${"%" + serviceName + "%"}`);
};

export async function getProvider(email: string, hashedPassword: string) {
  const provider = await db
    .select()
    .from(Providers)
    .where(eq(Providers.email, email))
    .execute();

  if (provider.length === 0) return { message: "Provider not found" };
  if (provider[0].password != hashedPassword) {
    return { message: "Wrong Password" };
  }

  const providerId = provider[0].id;
  const slots = await db
    .select()
    .from(Slots)
    .where(eq(Slots.providerId, providerId))
    .execute();

  const meetings = await Promise.all(
    slots.map(async (slot) => {
      const slotMeetings = await db
        .select()
        .from(Meetings)
        .where(eq(Meetings.slotId, slot.id))
        .execute();
      return { ...slot, meetings: slotMeetings };
    })
  );

  const offlineSchedules = await db
    .select()
    .from(OfflineSchedules)
    .where(eq(OfflineSchedules.providerId, providerId))
    .execute();

  return {
    message: "Logged In Successfully",
    provider: provider[0],
    slots: meetings,
    offlineSchedules,
  };
}

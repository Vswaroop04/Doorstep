import { and, eq, sql } from "drizzle-orm";
import {
  Users,
  Providers,
  Meetings,
  OfflineSchedules,
  Services,
  Slots,
  Ratings,
} from "./schema";
import { db } from "@/lib/db";
import { format } from "date-fns";

export type TypeUser = typeof Users.$inferInsert;
export type TypeProvider = typeof Providers.$inferInsert;
export type TypeMeetings = typeof Meetings.$inferInsert;
export type TypeSlots = typeof Slots.$inferInsert;
export type TypeServices = typeof Services.$inferInsert;
export type TypeOfflineSchedules = typeof OfflineSchedules.$inferInsert;
export type TypeUserFeedback = typeof Ratings.$inferInsert;

export const insertNewUser = async (user: TypeUser) => {
  return await db.insert(Users).values(user).returning();
};
export const insertNewProvider = async (provider: TypeProvider) => {
  return db.transaction(async (tx) => {
    const providerResult = await tx
      .insert(Providers)
      .values(provider)
      .returning();

    const providerId = providerResult[0].id;

    const slotTimes = [9, 10, 11, 13, 14, 15];
    const currentDate = format(new Date(), "yyyy-MM-dd");

    for (const slotTime of slotTimes) {
      await tx.insert(Slots).values({
        providerId: providerId,
        date: currentDate,
        slotTime: `${slotTime}:00:00`,
        slotDuration: 1,
        slotStatus: "Active",
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      });
    }

    return providerResult;
  });
};
export const scheduleMeetingWithProvider = async (
  slotId: string,
  userId: string
) => {
  const slot = await db.query.Slots.findFirst({ where: eq(Slots.id, slotId) });
  if (slot?.slotStatus == "scheduled") {
    return { message: "This meeting slot has already been booked." };
  }
  return await db
    .insert(Meetings)
    .values({
      slotId: slotId,
      userId: userId,
      status: "requested",
    })
    .returning();
};

export const approveMeetingWithCustomer = async (
  slotId: string,
  meetingId: string
) => {
  const slot = await db.query.Slots.findFirst({ where: eq(Slots.id, slotId) });
  if (slot?.slotStatus == "scheduled") {
    return { message: "This slot has already been booked." };
  }
  await db
    .update(Slots)
    .set({ slotStatus: "scheduled" })
    .where(eq(Slots.id, slotId));
  return await db
    .update(Meetings)
    .set({ status: "scheduled" })
    .where(eq(Meetings.id, meetingId))
    .returning();
};

export const scheduleOfflineMeetingWithProvider = async (
  OfflineSchedule: TypeOfflineSchedules
) => {
  return await db.insert(OfflineSchedules).values(OfflineSchedule).returning();
};

export const searchService = async (serviceName: string) => {
  return await db
    .select()
    .from(Services)
    .where(sql`${Services.serviceName} LIKE ${"%" + serviceName + "%"}`);
};

export async function getService(limit: number) {
  return await db.query.Services.findMany({
    limit,
  });
}

export async function addService(serviceName: string) {
  return await db.insert(Services).values({ serviceName }).returning();
}

export async function getProvider(email: string, hashedPassword: string) {
  const providerWithRelations = await db.query.Providers.findFirst({
    where: and(eq(Providers.email, email)),
    columns: {
      password: false,
    },
    with: {
      slots: {
        with: {
          meetings: true,
        },
      },
      offlineSchedules: true,
      ratings: true,
    },
  });

  if (!providerWithRelations)
    return { message: "Provider not found or wrong password" };

  return {
    provider: providerWithRelations,
  };
}

export async function getUser(email: string, hashedPassword: string) {
  const usersWithRelations = await db.query.Users.findFirst({
    where: and(eq(Users.email, email), eq(Users.password, hashedPassword)),
    with: {
      offlineSchedules: true,
      meetings: {
        with: {
          slot: true,
        },
      },
    },
  });

  if (!usersWithRelations)
    return { message: "Provider not found or wrong password" };

  return {
    user: usersWithRelations,
  };
}

export async function userFeedback(feedback: TypeUserFeedback) {
  return await db.insert(Ratings).values(feedback).returning();
}

export async function getSlots(ProviderId: string) {
  return await db.query.Slots.findMany({
    where: (slots, { eq }) => eq(slots.providerId, ProviderId),
    with: {
      meetings: true,
    },
  });
}
export async function getProviders(page: number) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const paginatedProvidersQuery = await db
    .select({
      id: Providers.id,
      name: Providers.name,
      email: Providers.email,
      lat: Providers.lat,
      long: Providers.long,
      offlineDuration: Providers.offlineDuration,
      mobile: Providers.mobile,
      createdAt: Providers.createdAt,
      updatedAt: Providers.updatedAt,
    })
    .from(Providers)
    .limit(pageSize)
    .offset(offset);
  return paginatedProvidersQuery;
}

export async function getFeedback(providerId: string) {
  return await db.query.Slots.findMany({
    where: (Ratings, { eq }) => eq(Ratings.providerId, providerId),
  });
}

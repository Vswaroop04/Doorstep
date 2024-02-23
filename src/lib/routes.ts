import bcrypt from "bcrypt";
import { and, asc, desc, eq, sql } from "drizzle-orm";
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
import { sendMail } from "./services/mailService";

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
  provider.averageRating = 0;
  return db.transaction(async (tx) => {
    const providerResult = await tx
      .insert(Providers)
      .values(provider)
      .returning();

    const providerId = providerResult[0].id;

    const slotTimes = [10, 11, 13, 15, 17, 19];
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

export async function getAllProviderIds(): Promise<string[]> {
  const result = await db.query.Providers.findMany({
    columns: { id: true },
  });
  return result.map((provider: { id: string }) => provider.id);
}
export const createSlots = async (providerId: string) => {
  return db.transaction(async (tx) => {
    const slotTimes = [10, 11, 13, 15, 17, 19];
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
  });
};

export const scheduleMeetingWithProvider = async (
  slotId: string,
  userId: string
) => {
  const slot = await db.query.Slots.findFirst({ where: eq(Slots.id, slotId) });
  if (slot?.slotStatus == "scheduled") {
    return { message: "This meeting slot had already been booked." };
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
    .set({ slotStatus: "Scheduled" })
    .where(eq(Slots.id, slotId));
  const meetings = await db
    .update(Meetings)
    .set({ status: "Scheduled" })
    .where(eq(Meetings.id, meetingId))
    .returning();

  const meetingsWithUserDetails = await db.query.Meetings.findFirst({
    where: (meeting) => eq(meeting.id, meetingId),
    with: {
      user: true,
    },
  });
  if (meetingsWithUserDetails?.user?.email) {
    const mail = await sendMail(
      "Meeting With Provider",
      meetingsWithUserDetails?.user?.email,
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Meet Call</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            max-width: 600px;
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
            margin-bottom: 15px;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the Google Meet Call</h1>
        <p>Please join the call according to your scheduled slot time.</p>
        <p>Slot Time: <strong> ${slot?.slotTime} </strong></p>
        <p>Google Meet Link: <a href="https://meet.google.com/avo-bmmx-evu">https://meet.google.com/avo-bmmx-evu</a></p>
        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:contact@doorstep.com">contact@doorstep.com</a>.</p>
        <p>Thanks, Doorstep</p>
    </div>
</body>
</html>
`
    );
  }
  return meetings;
};

export const rejectMeetingWithCustomer = async (
  meetingId: string,
  slotId: string
) => {
  return await db
    .update(Meetings)
    .set({ status: "Rejected" })
    .where(eq(Meetings.id, meetingId))
    .returning();
};

export const scheduleOfflineMeetingWithProvider = async (
  OfflineSchedule: TypeOfflineSchedules
) => {
  return await db.insert(OfflineSchedules).values(OfflineSchedule).returning();
};

export const editProvider = async (
  providerId: string,
  offlineDuration?: number,
  slots?: string[]
) => {
  if (offlineDuration) {
    return await db
      .update(Providers)
      .set({ offlineDuration })
      .where(eq(Providers.id, providerId))
      .returning();
  }
  if (slots) {
    await db.delete(Slots).where(eq(Slots.providerId, providerId));
    for (const slotTime of slots) {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      await db.insert(Slots).values({
        providerId: providerId,
        date: currentDate,
        slotTime: `${slotTime}:00:00`,
        slotDuration: 1,
        slotStatus: "Active",
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      });
    }
    return { message: "Slots edited the provider!" };
  }
  return { message: "Successfully edited the provider!" };
};

export const searchService = async (serviceName: string) => {
  return await db
    .select()
    .from(Services)
    .where(sql`${Services.serviceName} LIKE ${"%" + serviceName + "%"}`);
};

export const serviceExists = async (serviceName: string) => {
  const serviceExists = await db.query.Services.findFirst({
    where: eq(Services.serviceName, serviceName),
  });
  if (serviceExists) {
    return { success: true, message: "Service Exists" };
  } else {
    return { success: false, message: "Service Doesnt Exist" };
  }
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
    with: {
      slots: {
        with: {
          meetings: {
            with: {
              user: {
                columns: {
                  password: false,
                },
              },
            },
          },
        },
      },
      offlineSchedules: {
        with: {
          user: {
            columns: {
              password: false,
            },
          },
        },
      },
      ratings: {
        with: {
          user: {
            columns: {
              password: false,
            },
          },
        },
      },
    },
  });

  if (!providerWithRelations) {
    return { message: "Provider not found" };
  }
  const validPassword = await bcrypt.compare(
    hashedPassword,
    providerWithRelations?.password
  );

  if (!validPassword) {
    return { message: "Wrong password" };
  }
  return {
    provider: providerWithRelations,
  };
}

export async function getUser(email: string, hashedPassword: string) {
  const usersWithRelations = await db.query.Users.findFirst({
    where: and(eq(Users.email, email)),
    with: {
      offlineSchedules: {
        with: {
          provider: {
            columns: {
              password: false,
            },
          },
        },
      },
      meetings: {
        with: {
          slot: {
            with: {
              provider: {
                columns: {
                  password: false,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!usersWithRelations)
    return { message: "User not found or wrong password" };

  const validPassword = await bcrypt.compare(
    hashedPassword,
    usersWithRelations?.password
  );

  return {
    user: usersWithRelations,
  };
}

export async function getProviderById(id: string) {
  const providerWithRelations = await db.query.Providers.findFirst({
    where: and(eq(Providers.id, id)),
    with: {
      slots: {
        with: {
          meetings: {
            with: {
              user: {
                columns: {
                  password: false,
                },
              },
            },
          },
        },
      },
      offlineSchedules: {
        with: {
          user: {
            columns: {
              password: false,
            },
          },
        },
      },
      ratings: {
        with: {
          user: {
            columns: {
              password: false,
            },
          },
        },
      },
    },
  });

  if (!providerWithRelations) {
    return { message: "Provider not found" };
  }

  return {
    provider: providerWithRelations,
  };
}

export async function getUserById(id: string) {
  const usersWithRelations = await db.query.Users.findFirst({
    where: and(eq(Users.id, id)),
    with: {
      offlineSchedules: {
        with: {
          provider: {
            columns: {
              password: false,
            },
          },
        },
      },
      meetings: {
        with: {
          slot: {
            with: {
              provider: {
                columns: {
                  password: false,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!usersWithRelations)
    return { message: "User not found or wrong password" };

  return {
    user: usersWithRelations,
  };
}

export async function userFeedback(feedback: TypeUserFeedback) {
  await db.transaction(async (tx) => {
    const provider = await tx.query.Providers.findFirst({
      where: eq(Providers.id, feedback.providerId),
    });

    if (provider) {
      const averageRating =
        ((feedback.cleanliness ?? 0) +
          (feedback.efficiency ?? 0) +
          (feedback.problemResolution ?? 0) +
          (feedback.professionalism ?? 0) +
          (feedback.punctuality ?? 0) +
          (feedback.resolutionTime ?? 0)) /
        7;

      let totalAvgRating = averageRating;
      if (provider?.averageRating) {
        totalAvgRating = averageRating + provider?.averageRating;
      }

      await tx
        .update(Providers)
        .set({ averageRating: totalAvgRating })
        .where(eq(Providers.id, feedback.providerId));
    }
  });
  return await db.insert(Ratings).values(feedback).returning();
}

export async function FeedbackExists(providerId: string, userId: string) {
  const ratingExist = await db.query.Ratings.findFirst({
    where: (ratings, { eq }) =>
      eq(ratings.userId, userId) && eq(ratings.providerId, providerId),
  });

  return !!ratingExist;
}
export async function getSlots(ProviderId: string) {
  return await db.query.Slots.findMany({
    where: (slots, { eq }) => eq(slots.providerId, ProviderId),
    with: {
      meetings: true,
    },
  });
}

export async function getSlotsForProviders(ProviderId: string) {
  return await db.query.Slots.findMany({
    where: (slots, { eq }) => eq(slots.providerId, ProviderId),
  });
}
export async function getProviders(
  page: number,
  serviceName?: string,
  sort?: { rating?: number; distance?: number },
  lat?: number,
  long?: number
) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  let orderByClause;
  let whereClause;

  if (sort?.distance) {
    orderByClause = sql`distance`;
  } else if (sort?.rating) {
    orderByClause =
      sort.rating === 1
        ? desc(Providers.averageRating)
        : asc(Providers.averageRating);
  }
  if (serviceName) {
    whereClause = eq(Providers.serviceName, serviceName);
  }

  if (sort?.distance && lat != null && long != null) {
    const providersQuery = db
      .select({
        id: Providers.id,
        name: Providers.name,
        email: Providers.email,
        lat: Providers.lat,
        long: Providers.long,
        serviceName: Providers.serviceName,
        averageRating: Providers.averageRating,
        createdAt: Providers.createdAt,
        updatedAt: Providers.updatedAt,
        distance:
          sql`(6371 * acos(cos(radians(${lat})) * cos(radians(Providers.lat)) * cos(radians(Providers.long) - radians(${long})) + sin(radians(${lat})) * sin(radians(Providers.lat))))`.as(
            "distance"
          ),
      })
      .from(Providers)
      .leftJoin(Slots, eq(Providers.id, Slots.providerId))
      .where(whereClause)
      .groupBy(Providers.id) // Assuming Providers.id is the unique identifier
      .orderBy(sql`distance`)
      .limit(pageSize)
      .offset(offset);

    const providers = await providersQuery.execute();

    for (const provider of providers) {
      (provider as any).slots = await getSlotsForProviders(provider.id);
    }
    return providers;
  } else {
    return await db.query.Providers.findMany({
      where: whereClause,
      columns: {
        password: false,
      },
      with: {
        slots: true,
        ratings: true,
      },
      orderBy: orderByClause,
      limit: pageSize,
      offset: offset,
    });
  }
}
export async function getFeedback(providerId: string) {
  return await db.query.Ratings.findMany({
    where: (Ratings, { eq }) => eq(Ratings.providerId, providerId),
  });
}

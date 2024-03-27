import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  customType,
  uuid,
  bigint,
} from "drizzle-orm/pg-core";

const customFloat = customType<{ data: number }>({
  dataType() {
    return "double precision";
  },
});
export const Services = pgTable(
  "services",
  {
    serviceId: serial("serviceId").primaryKey(),
    serviceName: text("serviceName").notNull(),
  },
  (service) => {
    return {
      uniqueServiceId: uniqueIndex("serviceName").on(service.serviceName),
    };
  }
);

export const Users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    lat: customFloat("lat").notNull(),
    long: customFloat("long").notNull(),
    mobile: bigint("mobile", { mode: "number" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    cardDetails: text("cardDetails"),
    expiryDate: text("expiryDate"),
    cvc: text("cvc"),
    nameOnCard: text("nameOnCard"),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);
const customNumArray = customType<{ data: number[] }>({
  dataType() {
    return "integer[]";
  },
});
export const Providers = pgTable(
  "providers",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    lat: customFloat("lat").notNull(),
    long: customFloat("long").notNull(),
    offlineDuration: customFloat("offlineDuration").notNull(),
    onlinePrice: customFloat("onlinePrice").notNull(),
    slotsArray: customNumArray("slots").notNull(),
    offlinePrice: customFloat("offlinePrice").notNull(),
    serviceName: text("serviceName").notNull(),
    mobile: bigint("mobile", { mode: "number" }),
    averageRating: customFloat("averageRating"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (providers) => {
    return {
      providerId: uniqueIndex("providerId").on(providers.email),
    };
  }
);

export const Slots = pgTable(
  "slots",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    providerId: uuid("provider_id")
      .references(() => Providers.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date").notNull(),
    slotTime: text("slotTime").notNull(),
    slotDuration: customFloat("slotDuration").notNull(),
    slotStatus: text("slotStatus"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (slots) => ({
    slotsUniqueConstraint: uniqueIndex("slots_unique_constraint").on(
      slots.providerId,
      slots.date,
      slots.slotTime
    ),
  })
);

export const providersRelations = relations(Providers, ({ many }) => ({
  slots: many(Slots),
  offlineSchedules: many(OfflineSchedules),
  OnlineMeetingReq: many(OnlineMeetingReq),
  ratings: many(Ratings),
}));

export const usersRelations = relations(Users, ({ many }) => ({
  offlineSchedules: many(OfflineSchedules),
  OnlineMeetingReq: many(OnlineMeetingReq),
  meetings: many(Meetings),
}));

export const Meetings = pgTable(
  "meetings",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    slotId: uuid("slotId").references(() => Slots.id, { onDelete: "cascade" }),
    userId: uuid("userId").references(() => Users.id, { onDelete: "cascade" }),
    status: text("status"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (meetings) => ({
    meetingsUniqueConstraint: uniqueIndex("meetings_unique_constraint").on(
      meetings.slotId,
      meetings.userId
    ),
  })
);

export const slotsRelations = relations(Slots, ({ one, many }) => ({
  meetings: many(Meetings),
  provider: one(Providers, {
    fields: [Slots.providerId],
    references: [Providers.id],
  }),
}));

export const meetingsRelations = relations(Meetings, ({ one }) => ({
  user: one(Users, { fields: [Meetings.userId], references: [Users.id] }),
  slot: one(Slots, { fields: [Meetings.slotId], references: [Slots.id] }),
}));

export const OfflineSchedules = pgTable(
  "offline_meetings",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    providerId: uuid("provider_id")
      .references(() => Providers.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date"),
    offlineSlotTime: text("slotTime"),
    offlineSlotDuration: customFloat("slotDuration"),
    status: text("status"),
    priority: integer("priority"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (offlineschedules) => ({
    offlineschedulesUniqueConstraint: uniqueIndex(
      "offlineschedules_unique_constraint"
    ).on(
      offlineschedules.providerId,
      offlineschedules.userId,
      offlineschedules.date,
      offlineschedules.offlineSlotTime
    ),
  })
);

export const OnlineMeetingReq = pgTable(
  "online_meeting_reqs",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    providerId: uuid("provider_id")
      .references(() => Providers.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date"),
    offlineSlotTime: text("slotTime"),
    offlineSlotDuration: customFloat("slotDuration"),
    status: text("status"),
    priority: integer("priority"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (offlineschedules) => ({
    offlineschedulesUniqueConstraint: uniqueIndex(
      "onlinemeeting_unique_constraint"
    ).on(
      offlineschedules.providerId,
      offlineschedules.userId,
      offlineschedules.date,
      offlineschedules.offlineSlotTime
    ),
  })
);
export const onlineMeetingReqsRelations = relations(
  OnlineMeetingReq,
  ({ one }) => ({
    user: one(Users, {
      fields: [OnlineMeetingReq.userId],
      references: [Users.id],
    }),
    provider: one(Providers, {
      fields: [OnlineMeetingReq.providerId],
      references: [Providers.id],
    }),
  })
);
export const Ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => Users.id)
    .notNull(),
  providerId: uuid("provider_id")
    .references(() => Providers.id)
    .notNull(),
  punctuality: customFloat("punctuality"),
  professionalism: customFloat("professionalism"),
  problemResolution: customFloat("problem_resolution"),
  efficiency: customFloat("efficiency"),
  cleanliness: customFloat("cleanliness"),
  responseTime: customFloat("response_time"),
  resolutionTime: customFloat("resolution_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offlineSchedulesRelations = relations(
  OfflineSchedules,
  ({ one }) => ({
    user: one(Users, {
      fields: [OfflineSchedules.userId],
      references: [Users.id],
    }),
    provider: one(Providers, {
      fields: [OfflineSchedules.providerId],
      references: [Providers.id],
    }),
  })
);

export const ratingsRelations = relations(Ratings, ({ one }) => ({
  user: one(Users, { fields: [Ratings.userId], references: [Users.id] }),
  provider: one(Providers, {
    fields: [Ratings.providerId],
    references: [Providers.id],
  }),
}));

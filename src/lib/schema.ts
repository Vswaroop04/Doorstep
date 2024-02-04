import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  customType,
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
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    lat: customFloat("lat"),
    long: customFloat("long"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const Providers = pgTable(
  "providers",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    lat: customFloat("lat"),
    long: customFloat("long"),
    offlineDuration: customFloat("offlineDuration"),
    mobile: integer("mobile"),
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
    id: serial("id").primaryKey(),
    providerId: integer("provider_id").references(() => Providers.id),
    date: text("date").notNull(),
    slotTime: text("slotTime"),
    slotDuration: customFloat("slotDuration"),
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
  
}));

export const usersRelations = relations(Users, ({ many }) => ({
  slots: many(Slots),
  offlineSchedules: many(OfflineSchedules),
  
}));

export const Meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  slotId: integer("slot_id").references(() => Slots.id),
  userId: integer("user_id").references(() => Users.id),
  status: text("status"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(meetings) => ({
    meetingsUniqueConstraint: uniqueIndex("meetings_unique_constraint").on(
      meetings.slotId,
      meetings.userId,
    ),
  }));

export const slotsRelations = relations(Slots, ({ many }) => ({
  meetings: many(Meetings),
}));

export const OfflineSchedules = pgTable("meetings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id),
  date: text("date").notNull(),
  providerId: integer("provider_id").references(() => Providers.id),
  offlineSlotTime: text("slotTime"),
  offlineSlotDuration: customFloat("slotDuration"),
  priority: integer("priority"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(offlineschedules) => ({
    offlineschedulesUniqueConstraint: uniqueIndex("offlineschedules_unique_constraint").on(
      offlineschedules.providerId,
      offlineschedules.userId,
      offlineschedules.date,
      offlineschedules.offlineSlotTime
    ),
  }));

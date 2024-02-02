import "@/lib/config";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { user, Provider } from "./schema";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  const selectResu1t = await db.select().from(user);
  console.log(" Results ", selectResu1t);
};

export type NewUser = typeof user.$inferInsert;
export type NewProvider = typeof Provider.$inferInsert;


export const insertUser = async (users: NewProvider) => {
  return db.insert(Provider).values(users).returning();
};

export const getUsers2 = () => {
    const result = db.query.user.findMany();
    return result
}
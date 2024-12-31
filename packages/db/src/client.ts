import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle({
  connection:{
    url: process.env.DB_URL,
    authToken:process.env.DB_TOKEN
  },
  schema,
  casing: "snake_case",
});

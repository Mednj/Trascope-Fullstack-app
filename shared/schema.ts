import { pgTable, text, serial, uuid, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  merchantName: varchar("merchant_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("MERCHANT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const merchantSites = pgTable("merchant_sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posDevices = pgTable("pos_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: varchar("device_id", { length: 255 }).notNull().unique(),
  model: varchar("model", { length: 255 }).notNull(),
  siteId: uuid("site_id").notNull().references(() => merchantSites.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  status: varchar("status", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  posDeviceId: uuid("pos_device_id").notNull().references(() => posDevices.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMerchantSiteSchema = createInsertSchema(merchantSites).omit({
  id: true,
  createdAt: true,
});

export const insertPosDeviceSchema = createInsertSchema(posDevices).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MerchantSite = typeof merchantSites.$inferSelect;
export type InsertMerchantSite = z.infer<typeof insertMerchantSiteSchema>;
export type PosDevice = typeof posDevices.$inferSelect;
export type InsertPosDevice = z.infer<typeof insertPosDeviceSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Extended types for API responses
export type TransactionWithDetails = Transaction & {
  posDevice: PosDevice;
  site: MerchantSite;
};

export type PosDeviceWithSite = PosDevice & {
  site: MerchantSite;
};

export type MerchantSiteWithDevices = MerchantSite & {
  devices: PosDevice[];
};

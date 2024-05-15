import z from "zod"
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
});

export const insertCategoriesSchema = createInsertSchema(categories);

export const categorysRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id")
    .references(() => categories.id, {
      onDelete: "set null",
    })
    .notNull(),
});

export const transactionsRelations = relations(transactions,({one})=>({
    account: one(accounts,{
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    category: one(categories,{
        fields: [transactions.categoryId],
        references: [categories.id],
    })
}))

export const insertTransactionSchema = createInsertSchema(transactions,{
    date: z.coerce.date()
})
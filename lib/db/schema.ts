import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailverified').notNull(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdat').notNull(),
  updatedAt: timestamp('updatedat').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey().notNull(),
  expiresAt: timestamp('expiresat').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdat').notNull(),
  updatedAt: timestamp('updatedat').notNull(),
  ipAddress: text('ipaddress'),
  userAgent: text('useragent'),
  userId: text('userid')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey().notNull(),
  accountId: text('accountid').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provideraccountid').notNull(),
  refreshToken: text('refreshtoken'),
  accessToken: text('accesstoken'),
  expiresAt: integer('expiresat'),
  password: text('password'),
  createdAt: timestamp('createdat').notNull(),
  updatedAt: timestamp('updatedat').notNull(),
  userId: text('userid')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey().notNull(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresat').notNull(),
  createdAt: timestamp('createdat'),
  updatedAt: timestamp('updatedat'),
})

// Expense Tracker tables
export const categories = pgTable(
  'categories',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').default('#3b82f6').notNull(),
    icon: text('icon').default('tag').notNull(),
    createdAt: timestamp('createdat').notNull().defaultNow(),
  },
  (table) => ({
    userIdNameUnique: uniqueIndex('categories_userId_name_unique').on(
      table.userId,
      table.name
    ),
  })
)

export const monthlyBudgets = pgTable(
  'monthly_budgets',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('userid')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    budgetLimit: decimal('budget_limit', { precision: 15, scale: 2 })
      .notNull()
      .default('500000'),
    createdAt: timestamp('createdat').notNull().defaultNow(),
    updatedAt: timestamp('updatedat').notNull().defaultNow(),
  },
  (table) => ({
    userIdMonthYearUnique: uniqueIndex('monthly_budgets_userId_month_year_unique').on(
      table.userId,
      table.month,
      table.year
    ),
  })
)

export const expenses = pgTable('expenses', {
  id: text('id').primaryKey().notNull(),
  userId: text('userid')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  categoryId: text('categoryid').references(() => categories.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  date: date('date').notNull().defaultNow(),
  createdAt: timestamp('createdat').notNull().defaultNow(),
  updatedAt: timestamp('updatedat').notNull().defaultNow(),
})

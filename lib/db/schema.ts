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
  emailVerified: boolean('emailVerified').notNull(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey().notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey().notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  password: text('password'),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  idToken: text('idToken'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey().notNull(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// Expense Tracker tables
export const categories = pgTable(
  'categories',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').default('#3b82f6').notNull(),
    icon: text('icon').default('tag').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
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
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    budgetLimit: decimal('budgetLimit', { precision: 15, scale: 2 })
      .notNull()
      .default('500000'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
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
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  categoryId: text('categoryId').references(() => categories.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  date: date('date').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

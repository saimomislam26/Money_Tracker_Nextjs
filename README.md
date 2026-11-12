# Moneywise — personal finance tracker

Next.js 14 + Tailwind client, Express + MongoDB API.

## Run it

```bash
# API (http://localhost:5000)
cd server && npm install && npm run dev

# Web app (http://localhost:3000)
cd client && npm install && npm run dev
```

`server/.env` needs `DB_URL`, `JWT_SECRET_KEY`, `PORT`, `TOKEN_EXPIRES_TIME`, `CLIENT_URL`
(comma-separated allowed origins) and the three `CLOUDINARY_*` keys (profile photos only).
`client/.env` needs `NEXT_PUBLIC_API_URL=http://localhost:5000`.

| Script (server)   | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run seed`    | Creates/resets `demo@example.com` / `Demo@12345` with 6 months of data |
| `npm run migrate` | One-off: converts legacy `spendings` + `monthlyIncomes` into transactions |

## Features

- **Dashboard** – net balance, income, expenses, savings rate with month-over-month deltas, daily spending chart,
  category donut, 6-month trend, insights (avg daily spend, month-end projection, top category), budget alerts, upcoming bills.
- **Transactions** – income *and* expenses, search, filters (type/category/date range), sorting, pagination, CSV export, quick-add with the `N` key.
- **Budgets** – monthly limit per category with progress and over-budget warnings.
- **Savings goals** – targets, deadlines, required monthly saving, contributions/withdrawals.
- **Recurring** – weekly/monthly/yearly bills and income that post automatically (back-filled when due).
- **Reports** – yearly income vs expenses, best/worst month, category breakdowns.
- **Categories** – custom colors and icons for income and expense categories.
- **Settings** – profile, currency, avatar, password change, light/dark/system theme, account deletion.

## Structure

```
server/src
  config/       env loading
  models/       User, Category, Transaction, Budget, Goal, Recurring
  routes/       one router, mounted at /api
  controllers/  thin HTTP handlers per resource
  services/     auth, analytics (aggregations), recurring processing, default categories
  middleware/   auth, error handling, upload
  utils/        zod schemas + validate(), dates, ApiError, asyncHandler
  scripts/      seed, migrateLegacy

client/src
  app/(auth)/   login, register
  app/(app)/    dashboard, transactions, budgets, goals, recurring, reports, categories, settings
  components/   ui primitives, charts, layout shell, transaction modal
  context/      auth + theme
  hooks/        SWR wrapper (useApi / refreshAll)
  lib/          axios client, types, formatters
```

## API (all under `/api`, JWT bearer except auth)

`POST /auth/register|login` · `GET /auth/me` · `PUT /users/me`, `/users/me/password`, `/users/me/avatar` · `DELETE /users/me` ·
`/categories` · `/transactions` (+ `/export`) · `/budgets` · `/goals` (+ `/:id/contribute`) · `/recurring` ·
`GET /analytics/dashboard?month=YYYY-MM` · `GET /analytics/yearly?year=YYYY`

# ESSMA OS - Enterprise Power Infrastructure Operating System

ESSMA OS is a production-grade enterprise management system tailored for the power infrastructure domain. It is built on a modern, robust technology stack ensuring security, scalability, and realtime data consistency.

## Tech Stack

*   **Frontend**: Next.js (App Router), React, Tailwind CSS, TypeScript
*   **State Management & Data Fetching**: TanStack Query
*   **Backend & Database**: Supabase (PostgreSQL)
*   **Authentication & Authorization**: Supabase Auth with Row-Level Security (RLS)
*   **Realtime**: Supabase Realtime
*   **Storage**: Supabase Storage

## Core Modules & Features

The system is organized into several key domains, each backed by a fully normalized, strictly typed PostgreSQL schema.

### 1. User & RBAC Architecture
*   **Profiles**: Integrated closely with Supabase Auth for identity management.
*   **Roles & Permissions**: Granular permissions (e.g., `customers.create`, `service.dispatch`).
*   **Row-Level Security (RLS)**: Database-level enforcement guaranteeing users can only access data belonging to their respective organizations, regardless of UI state.

### 2. Customers Management
*   **Client Records**: Comprehensive profiles including billing/service addresses, GST/PAN details, and contact points.
*   **Relationships**: Connects customers deeply to their respective equipment, service tickets, AMCs, invoices, and payment history.

### 3. Equipment Lifecycle
*   **Asset Tracking**: Serial numbers, types, brands, and models.
*   **Lifecycle Management**: Installation, warranty tracking, and service history tracking.

### 4. Service Operations
*   **Service Tickets**: Track issues from creation through assignment, dispatch, and closure.
*   **Assignments & Dispatch**: Assign technicians to tickets, tracking status changes.
*   **Service Visits**: Detailed logs of technician visits, including work summaries, parts consumed, and arrival/departure times.

### 5. Annual Maintenance Contracts (AMC)
*   **Contract Management**: Track AMC start/end dates, values, and linked equipment.
*   **Billing & Renewals**: Automates status transitions (e.g., Active -> Expiring -> Expired).

### 6. Inventory & Warehousing
*   **Multi-Warehouse Support**: Track inventory levels across different locations.
*   **Atomic Transactions**: Inventory consumption (e.g., parts used in service tickets) uses PostgreSQL functions to guarantee atomicity and prevent stock anomalies.
*   **Supplier Management**: Track inventory origins and purchase costs.

### 7. Finance & Billing
*   **Invoicing**: Generate invoices for AMCs, Service Tickets, or ad-hoc sales.
*   **Payments**: Record payments against invoices, automatically recalculating outstanding balances.

### 8. Audit, Logs & Notifications
*   **Audit Trail**: Every significant mutation (Create, Update, Delete) is logged via PostgreSQL triggers, capturing `old_data`, `new_data`, and the responsible user.
*   **Realtime Notifications**: WebSockets via Supabase Realtime notify users of critical updates (new tickets, stock alerts).
*   **Document Storage**: Files (signatures, invoices, avatars) are securely stored in Supabase Storage with linked DB metadata.

## Local Development Setup

### Prerequisites
*   Node.js (v18+)
*   Docker (for local Supabase)
*   Supabase CLI

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Supabase
```bash
npx supabase start
```
*This spins up the entire Supabase stack (PostgreSQL, GoTrue, Realtime, Storage, etc.) locally via Docker.*

### 3. Run Migrations
```bash
npx supabase db push
```
*Applies all schemas, functions, triggers, and RLS policies (001_extensions.sql through 018_seed_roles_permissions.sql).*

### 4. Generate Types
```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

### 5. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## Architecture Principles

1.  **Database as the Source of Truth**: There is zero mock data, no local fallback DB, and no fake CRUD. All operations map to actual PostgreSQL queries.
2.  **Domain-Driven Repositories**: The UI never directly calls Supabase. It uses TanStack Query hooks, which call Domain Services, which in turn use strictly typed Repositories.
3.  **Strict TypeScript**: `strict: true` is enforced. No `any` types. DB types generated directly from the schema guarantee frontend-backend contract safety.
4.  **Database Functions & Triggers**: Complex operations (like consuming inventory and updating stock counts) are handled as single atomic transactions using Pl/pgSQL functions.

## Deployment

ESSMA OS is designed to be deployed with:
- **Frontend**: Vercel or similar Next.js hosting platform.
- **Backend**: Supabase Cloud (Managed PostgreSQL).

Ensure all environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set in your deployment environment.
remo
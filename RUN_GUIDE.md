# NexusCRM - Run Instructions

Your Lead Management System (NexusCRM) has been upgraded with a professional UI and backend fixes. Follow these steps to run the application.

## Prerequisites
- PostgreSQL running locally
- Node.js & pnpm installed

## 1. Environment Setup
Ensure your PostgreSQL database is running. The services will attempt to connect to:
- User Service: `localhost:5432` (db: `postgres` or similar, check `.env` if needed)
- Lead Service: `localhost:5432`

## 2. Start Backend Services
Open 3 separate terminals for the microservices:

**Terminal 1: Auth Service (Port 4001)**
```bash
cd apps/auth-service
pnpm dev
```

**Terminal 2: User Service (Port 4002)**
```bash
cd apps/user-service
pnpm dev
```
*Note: This service will automatically seed a default admin user: `admin@nexus.com` / `admin123`*

**Terminal 3: Lead Service (Port 4003)**
```bash
cd apps/lead-service
pnpm dev
```
*Note: This service will automatically seed the required Lead Stages.*

## 3. Start Frontend
**Terminal 4: Frontend (Port 5173)**
```bash
cd apps/frontend
pnpm dev
```

## 4. Usage
1. Open your browser to `http://localhost:5173`.
2. Login with the default credentials:
   - **Email:** `admin@nexus.com`
   - **Password:** `admin123`
3. Navigate to **Leads** to add and manage your leads.

## Summary of Changes
- **UI Redesign**: Complete overhaul using **Tailwind CSS** for a premium, modern look (Dashboard, Leads Table, Login, Sidebar).
- **Backend Fixes**:
  - Fixed `lead-service` database column mismatch (`firstContactedAt`).
  - Added automatic **DB Seeding** for Lead Stages and Default User.
  - Secured Lead routes with Authentication Middleware.
- **Bug Fixes**:
  - Fixed Frontend API calls to correctly send Authorization tokens.
  - Fixed styling conflicts by removing legacy CSS.

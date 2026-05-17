# Campus Event Management System (Python Rebuild)

This project has been completely rebuilt with a high-performance custom architecture.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend (Production Core)**: Python Flask, SQLAlchemy, JWT Authentication, SQLite/PostgreSQL.
- **Backend (Live Preview)**: Node.js Express, SQLite, JWT (Identical architecture to the Python version).

## Features
- **Modern UI**: Full-stack replication of the original design with technical noir aesthetic.
- **Student Portal**:
  - Live Event Feed.
  - Profile & Point system.
  - **Leaderboard**: Compete for top participation ranks.
  - **Check-in**: Browser-based QR scanner for attendance.
  - **Certificates**: Automatically issued upon event completion.
- **Admin Panel**:
  - **Dashboard**: Advanced analytics using Recharts.
  - **Event CRUD**: Full control over events and registrations.
  - **Attendance Management**: View and export attendance data.
  - **Security**: JWT-based RBAC (Role Based Access Control).

## Deployment (Python)
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set Environment variables:
   - `SECRET_KEY`: Your JWT secret.
   - `DATABASE_URL`: Your DB connection string.
4. Run: `python app.py`.

## Live Development (Current Environment)
The preview environment runs a Node.js port of the Python backend to ensure full compatibility with the AI Studio runtime.
- Entry: `server.ts`
- Port: 3000

## Directory Structure
- `/backend`: Production Python Source.
- `/src`: Modular React Frontend.
- `/server.ts`: Live environment Node server.

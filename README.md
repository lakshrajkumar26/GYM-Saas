Gym Management Backend (Node.js + Prisma)

A Gym Management System backend built with Node.js, Express, Prisma (v6) and PostgreSQL (Supabase).
Supports members, plans, attendance, payments, roles, and authentication — ready for a single gym now, and SaaS-ready later.

🚀 Features

🔐 JWT Authentication (Owner / Trainer / Staff / Member)

🏋️ Gym & Member Management

📋 Membership Plans

📅 Attendance Tracking

💳 Payments & Status Updates

🧱 Prisma ORM (PostgreSQL)

🔒 Role-based access control

🏢 Gym-based data isolation (future SaaS ready)

🛠 Tech Stack

Backend: Node.js, Express

ORM: Prisma v6

Database: PostgreSQL (Supabase)

Auth: JWT

Tools: Postman, Prisma CLI

📁 Project Structure
server/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   ├── member.controller.js
│   │   ├── plan.controller.js
│   │   ├── payment.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │
│   ├── routes/
│   │   ├── member.routes.js
│   │   ├── plan.routes.js
│   │   ├── payment.routes.js
│   │
│   ├── app.js
│   └── routes.js
│
├── server.js
├── .env
├── package.json
└── README.md

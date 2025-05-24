# 🚀 Backend User Management

โปรเจค Backend สำหรับจัดการผู้ใช้และระบบสิทธิ์ โดยใช้ Bun, Express.js, TypeScript และ Prisma ORM

## 📋 Features

- 🔐 **Authentication** - JWT-based authentication
- 👥 **User Management** - CRUD operations สำหรับผู้ใช้
- 🛡️ **Role-Based Permissions** - ระบบจัดการสิทธิ์แบบ Role-Permission
- 🗄️ **Database** - MySQL database ด้วย Prisma ORM
- 🏗️ **TypeScript** - Type-safe development
- ⚡ **Bun Runtime** - Fast JavaScript runtime

## 🔧 Prerequisites

ตรวจสอบให้แน่ใจว่าได้ติดตั้งสิ่งต่อไปนี้แล้ว:

- **[Bun](https://bun.sh)** v1.2.9 หรือสูงกว่า
- **MySQL** 8.0 หรือสูงกว่า
- **Git** สำหรับ version control

### ตรวจสอบการติดตั้ง

```bash
# ตรวจสอบ Bun version
bun --version

# ตรวจสอบ MySQL
mysql --version
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd backend_user_management
```

### 2. ติดตั้ง Dependencies

```bash
# ติดตั้ง packages ทั้งหมด
bun install
```

### 3. ปรับค่า Environment Variables

สามารถปรับเเต่งค่า .env ได้ตามความเหมาะสมครับ

### 4. ตั้งค่า Database

#### สร้าง Database

```bash
# เข้า MySQL console
    docker compose up -d db
```

#### รัน Prisma Migrations

```bash
# Generate Prisma Client
bun prisma generate

# รัน database migrations
bun prisma migrate dev --name init
```

### 5. รันโปรเจค

```bash
# Development mode (แนะนำ)
bun run dev
```

เซิร์ฟเวอร์จะรันที่: **http://localhost:3001**

API Base URL: **http://localhost:3001/api/v1**

## 📁 โครงสร้างโปรเจค

```
backend_user_management/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   ├── database.ts        # Database connection
│   │   └── environment.ts     # Environment variables
│   ├── controller/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── userController.ts  # User management
│   │   ├── healthController.ts # Health check
│   │   └── seedController.ts  # Database seeding
│   ├── middleware/
│   │   └── auth.ts           # JWT middleware
│   ├── routes/
│   │   ├── authRoutes.ts     # Auth endpoints
│   │   ├── userRoutes.ts     # User endpoints
│   │   ├── healthRoutes.ts   # Health check
│   │   └── seedRoutes.ts     # Seed endpoints
│   ├── service/
│   │   ├── authService.ts    # Auth business logic
│   │   ├── userService.ts    # User business logic
│   │   ├── roleService.ts    # Role management
│   │   └── permissionService.ts # Permission management
│   ├── validator/
│   │   ├── authValidator.ts  # Auth validation
│   │   └── userValidator.ts  # User validation
│   ├── route.ts              # Main router
│   └── index.ts              # Application entry point
├── dist/                     # Compiled JavaScript (build output)
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # รันโปรเจคในโหมด development
bun run dev:ts           # รันด้วย ts-node-dev (hot reload)

# Production
bun run build            # Compile TypeScript to JavaScript
bun run start            # รันจาก compiled files (dist/)
bun run prod             # รันโปรเจคในโหมด production

# Database
bun prisma generate      # Generate Prisma client
bun prisma migrate dev   # รัน migrations (development)
bun prisma migrate deploy # รัน migrations (production)
bun prisma studio        # เปิด Prisma Studio (database GUI)
bun prisma db push       # Push schema ไป database โดยตรง
bun prisma db seed       # รัน database seeding (หากมี)

# Utilities
bun install              # ติดตั้ง dependencies
bun test                 # รัน tests (หากมี)
```

## 🗄️ Database Schema

ระบบใช้ MySQL database ด้วย Prisma ORM:

### Tables

- **User** - ข้อมูลผู้ใช้ (id, name, email, password, role_id)
- **Role** - บทบาท (id, name)
- **Permission** - สิทธิ์ (id, name)
- **Role_Permission** - ความสัมพันธ์ระหว่าง Role และ Permission

### Relations

- User → Role (Many-to-One)
- Role → Permission (Many-to-Many through Role_Permission)

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - ตรวจสอบสถานะเซิร์ฟเวอร์

### Authentication
- `POST /api/v1/auth/login` - เข้าสู่ระบบ
- `POST /api/v1/auth/register` - สมัครสมาชิก

### User Management
- `GET /api/v1/users` - ดึงรายการผู้ใช้ทั้งหมด
- `GET /api/v1/users/:id` - ดึงข้อมูลผู้ใช้เฉพาะ
- `POST /api/v1/users` - สร้างผู้ใช้ใหม่
- `PUT /api/v1/users/:id` - อัปเดตข้อมูลผู้ใช้
- `DELETE /api/v1/users/:id` - ลบผู้ใช้
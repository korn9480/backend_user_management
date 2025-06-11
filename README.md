# 🚀 Backend User Management

โปรเจค Backend สำหรับจัดการผู้ใช้และระบบสิทธิ์

## 🛠 เทคโนโลยีที่ใช้
- **Framework:** Express.js, TypeScript
- **Database ORM:** Prisma ORM
- **Runtime:** Bun
- **Database:** MySQL (ใช้ใน Docker)

## ⚡ วิธีติดตั้ง

1. โคลนโปรเจค  
   ```bash
   git clone https://github.com/korn9480/backend_user_management.git
   cd backend_user_management
   ```
2. สร้าง network ชื่อ `dev`  
   ```bash
   docker network create dev
   ```
3. สร้าง server database  
   ```bash
   docker compose up -d db
   ```
4. สร้าง database ชื่อ `user_management` ใน MySQL (เข้าไปสร้างใน container หรือใช้ client tool)

5. สร้างและรัน backend  
   ```bash
   docker compose up -d --build backend_user_management
   ```
6. เมื่อรันโปรเจค ระบบจะสร้างข้อมูล default ให้อัตโนมัติ

7. URL ของ api

เปิดเบราว์เซอร์และไปที่:
```
http://localhost:3001
```

---

### 🔧 การพัฒนาเพิ่มเติม

 การติดตั้งในโหมดพัฒนา (Development Mode)

หากต้องการพัฒนาโปรเจคเพิ่มเติม:

```bash
# ติดตั้ง dependencies
bun install

# รันในโหมดพัฒนา
bun run dev
```

## 📚 API ในโปรเจค

### Health Check
- `GET /api/v1/health` - ตรวจสอบสถานะเซิร์ฟเวอร์

### Authentication
- `POST /api/v1/auth/login` - เข้าสู่ระบบ
- `POST /api/v1/auth/register` - สมัครสมาชิก
- `GET /api/v1/auth/me` - ดึงข้อมูลผู้ใช้ด้วย token
- `POST /api/v1/auth/verify` - ตรวจสอบ token

### User Management
- `GET /api/v1/users` - ดึงรายการผู้ใช้ทั้งหมด
- `GET /api/v1/users/:id` - ดึงข้อมูลผู้ใช้เฉพาะ
- `POST /api/v1/users` - สร้างผู้ใช้ใหม่
- `PUT /api/v1/users/:id` - อัปเดตข้อมูลผู้ใช้
- `DELETE /api/v1/users/:id` - ลบผู้ใช้

## ➕ สิ่งพัฒนาเพิ่มจากครั้งเเรก

### 🚀 Api

- `POST /api/v1/auth/register` - สมัครสมาชิก

### 🤔 Logic

1. ก่อนสร้าง user จะมีการ check ว่าอีเมลที่สมัครถูกใช้ไปหรือยัง

2. เปลี่ยนวิธีการ set ข้อมูล database ค่าเริ่มต้น จากสร้าง ใช้ api เปลี่ยนมาใช้  ให้เองอัตโนมัติเมื่อ run โปรเจค

3. build โปรเจคเป็น docker containers
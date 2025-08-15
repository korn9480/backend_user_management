# การทดสอบ unit test
จะเเบ่งเป็นการทดสอบออกเป็น 2 แบบคือ

1. เขียน test controller สิ่งที่จะทดสอบคือ การ vaildate body params เเละ query เเละการทำงานภาย controller สำหรับ service เราจะ mock ขึ้นมาก่อน

2. เขียน test service สิ่งที่จะทดสอบคือ การ logic query database ว่าถูกต้องหรือไม่ สำหรับ service จะใช้ database จริงในการทดสอบน่ะ ตอน run unit test เเนะนำให้สร้าง database เเยกสำหรับใช้ในการรัน unit test

# Test Commands Reference

เอกสารนี้สรุปคำสั่งและฟังก์ชันที่ใช้ในการเขียนเทสจากไฟล์ทดสอบ  
(ทั้ง unit test และ integration test) ของโปรเจกต์นี้

---

## Structure & Grouping

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `describe` | vitest | จัดกลุ่ม test cases |
| `it` | vitest | ประกาศ test case (alias ของ `test`) |
| `test` | vitest | ประกาศ test case |

---

## Lifecycle Hooks

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `beforeEach` | vitest | รันโค้ดก่อนแต่ละ test case |
| `afterAll` | vitest | รันโค้ดหลังจาก test ทั้งหมดเสร็จ |

---

## Assertion Matchers

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `.toBe` | vitest | ตรวจค่าด้วย strict equality |
| `.toEqual` | vitest | ตรวจค่าด้วยการเทียบโครงสร้าง |
| `.toHaveLength` | vitest | ตรวจความยาวของ array/string |
| `.toHaveProperty` | vitest | ตรวจว่ามี property |
| `.not.toHaveProperty` | vitest | ตรวจว่าไม่มี property |
| `.toBeNull` | vitest | ตรวจว่าเป็น `null` |
| `.not.toBeNull` | vitest | ตรวจว่าไม่เป็น `null` |
| `.toBeUndefined` | vitest | ตรวจว่าเป็น `undefined` |
| `.not.toBeUndefined` | vitest | ตรวจว่าไม่เป็น `undefined` |
| `.toHaveBeenCalledWith` | vitest | ตรวจว่า mock function ถูกเรียกด้วย argument ตามที่คาด |

---

## Mocking

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `vi.mock` | vitest | Mock module ทั้งไฟล์ |
| `vi.clearAllMocks` | vitest | ล้าง mocks และ call history |
| `mockResolvedValue` | vitest | mock ให้ return Promise สำเร็จ |
| `mockRejectedValue` | vitest | mock ให้ return Promise error |
| `Mock` / `Mocked` | vitest | ระบุ type ให้ mocks (TypeScript) |

---

## Integration Testing

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `request(app)` | supertest | สร้าง request จำลองเพื่อทดสอบ API |
| `.post()` | supertest | ส่ง HTTP POST request |
| `.get()` | supertest | ส่ง HTTP GET request |
| `.send()` | supertest | ส่ง body data ใน request |

---

## Safety Check

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `if (process.env... !== 'test') throw new Error(...)` | Node.js | ป้องกันการรันไฟล์ test ใน environment ที่ไม่ใช่ `test` |

---

## Cleanup

| คำสั่ง / ฟังก์ชัน | แหล่งที่มา | คำอธิบาย |
|--------------------|------------|-----------|
| `afterAll` + `prismaClient.user.deleteMany()` | vitest + Prisma | ลบข้อมูลจาก DB หลังจบการทดสอบทั้งหมด |

---

## หมายเหตุ
- Vitest ใช้ syntax และ matchers เหมือน Jest จึงสามารถใช้ `.toBe`, `.toEqual` และ matchers อื่นได้เหมือนกัน  
- Supertest ใช้สำหรับทดสอบ API endpoint แบบ integration test โดยจำลองการส่ง request จริงไปยัง `express` app  
- Prisma ใช้ในการ cleanup ข้อมูล test หลังจากรันเสร็จ เพื่อไม่ให้ข้อมูลค้างในฐานข้อมูล

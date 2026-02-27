## Tech Stack

- **Node.js** + **Express** v5
- **MongoDB** + **Mongoose** v9
- **dotenv** สำหรับจัดการ environment variables

## Project Structure

```
ProductManagement/
├── app.js                        # Entry point
├── .env                          # Environment variables
├── package.json
├── models/
│   ├── Category.js               # Category schema
│   └── Product.js                # Product schema (categoryId as ObjectId ref)
├── services/
│   ├── categoryService.js        # Business logic - Category
│   └── productService.js        # Business logic - Product
├── controllers/
│   ├── categoryController.js     # HTTP handlers - Category
│   └── productController.js     # HTTP handlers - Product
└── routes/
    ├── categoryRoutes.js         # Category route definitions
    └── productRoutes.js         # Product route definitions
```

## Installation & Setup

### 1. Clone

```bash
git clone https://github.com/supersanyabot/ProductManagement.git
cd ProductManagement
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

เปิด MongoDB Atlas → เลือก Cluster → ปุ่ม **Connect** → **Connect your application** แล้วกด Copy connection string จากหน้าต่างที่ขึ้นมา
นำค่าที่ได้มาใส่ในไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
PORT=3000
```

> **หมายเหตุ:** แทนที่ `<username>`, `<password>`, `<cluster>` ด้วยค่าของ MongoDB Atlas ของคุณ

### 4. Run

```bash
npm start
```

หรือ

```bash
npm run dev
```

ถ้าไม่มี nodemon

```bash
npm i -g nodemon
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3000`

### 5. Troubleshooting การเชื่อม MongoDB Atlas

หากรัน `npm start` / `npm run dev` แล้วขึ้น `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net` ให้ตรวจสอบดังนี้:

1. **Whitelist IP บน MongoDB Atlas**
   - เข้า [MongoDB Atlas](https://cloud.mongodb.com) → *Security* → *Network Access*
   - กด **Add IP Address** แล้วเลือก
     - `0.0.0.0/0` (Allow Access from Anywhere) เพื่อทดสอบอย่างรวดเร็ว หรือ
     - ใช้ปุ่ม **Add Current IP Address** เพื่ออนุญาตเฉพาะเครื่องของคุณ

2. **เพิ่ม DNS ใน Code (กรณี DNS เดิมไม่รองรับ SRV)**
   - ตั้งค่า DNS เป็น 1.1.1.1 / 1.0.0.1 (Cloudflare) หรือ 8.8.8.8 / 8.8.4.4 (Google)
   - หรือในโค้ดสามารถตั้ง DNS resolver ได้ เช่น
     ```js
     const dns = require("node:dns/promises");
     dns.setServers(["1.1.1.1"]);
     ```
   - ควรตั้งในสภาพแวดล้อมที่ DNS เดิม resolve SRV ไม่ได้เท่านั้น

หลังจากทำตามขั้นตอนข้างต้นแล้ว ลอง `npm run dev` ใหม่เพื่อยืนยันว่าขึ้นข้อความ `Connected to MongoDB`

### 6. สร้าง Example Data
มีสคริปต์ `scripts/initdb.js` สำหรับล้าง products, categories เดิมแล้วสร้าง Example Data ใหม่
```bash
npm run initdb
```

> ต้องตั้งค่า `MONGODB_URI` ใน `.env` ให้เรียบร้อย เมื่อสำเร็จจะเห็นข้อความ `Seed completed successfully`

### 7. Postman Collection

ไฟล์ `ProductManagement.postman_collection.json`

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | ดึงรายการสินค้าทั้งหมด (pagination + regex search) |
| GET | `/product/:id` | ดึงสินค้าตาม ID |
| POST | `/product` | เพิ่มสินค้าใหม่ |
| PUT | `/product/:id` | แก้ไขสินค้า |
| DELETE | `/product/:id` | ลบสินค้า (soft delete เป็นค่าเริ่มต้น — เพิ่ม `?hard=true` เพื่อ hard delete)

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | ดึงรายการหมวดหมู่ทั้งหมด (pagination + regex search) |
| GET | `/category/:id` | ดึงหมวดหมู่ตาม ID |
| POST | `/category` | เพิ่มหมวดหมู่ใหม่ |
| PUT | `/category/:id` | แก้ไขหมวดหมู่ |
| DELETE | `/category/:id` | ลบหมวดหมู่ (soft delete เป็นค่าเริ่มต้น — เพิ่ม `?hard=true` เพื่อ hard delete)

---

## Query Parameters (GET list endpoints)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | หน้าที่ต้องการ |
| `limit` | number | 10 | จำนวนรายการต่อหน้า |
| `search` | string | - | ค้นหาชื่อด้วย Regular Expression (case-insensitive) |

**ตัวอย่าง:**
```
GET /products?page=1&limit=5&search=phone
GET /categories?page=1&limit=10&search=^elec
```

### Extra Query Parameters (DELETE endpoints)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hard` | boolean | false | ใช้กับ DELETE (Product/Category) เช่น `DELETE /product/:id?hard=true` เพื่อ hard delete |

**ตัวอย่าง:**
```
DELETE /product/123?hard=true
DELETE /category/456?hard=true
```

---

## Request Body Examples

### POST /category
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

### POST /product
```json
{
  "name": "iPhone 15",
  "price": 35900,
  "description": "Apple smartphone",
  "image": "https://example.com/iphone15.jpg",
  "categoryId": "<MongoDB ObjectId of category>"
}
```

---

## Response Format

### List response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Single item response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error response
```json
{
  "success": false,
  "message": "Error description"
}
```

---
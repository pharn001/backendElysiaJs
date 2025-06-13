# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
password: nothing

ຕິດຕັ້ງຄ່າການເຊື່ອມຕໍ່ prisma
```bash
npx tsc --init
```
```bash
npm install prisma --save-dev
```
```bash
 npx prisma init --datasource-provider mongodb --output ../generated/prisma
```
## ເພີ່ມໂມເດວໃນ ຖານຂໍ້ມູນ MongoDB  
```bash
bunx prisma db push

```
## run ຄຳສັ່ງ prisma
```bash
bunx prisma generate
```

# ✅ ขั้นตอน Merge master เข้า main
## 1 เช็คว่าอยู่ที่ branch main

```bash
git checkout main
```
## 2 ดึงข้อมูลล่าสุดของทั้งสอง branch ก่อน (กรณีทำงานร่วมกับ remote repo เช่น GitHub)
```bash
git fetch origin
```
## 3 Merge branch master เข้ากับ main
```bash
git merge master  
```
### . หากไม่มี conflict: Git จะรวมให้เรียบร้อย
### . หากมี conflict: Git จะแจ้งให้คุณแก้ไฟล์ที่มี conflict ก่อน แล้วค่อย commit

## 4 หลัง merge แล้ว ให้ push ไปยัง remote repository
```bash
git push origin main
```
# Dockerfile
# ใช้ Node.js เป็นฐาน
FROM node:16

# ตั้งค่า working directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# ติดตั้ง TypeScript (ถ้าจำเป็น)
RUN npm install -g typescript

# คัดลอกไฟล์ TypeScript และไฟล์อื่นๆ ไปยัง working directory
COPY . .

# คอมไพล์ TypeScript
RUN npm run build

# เปิดพอร์ตที่ใช้โดยแอปพลิเคชัน
EXPOSE 8080

# เริ่มเซิร์ฟเวอร์
CMD ["node", "dist/index.js"]

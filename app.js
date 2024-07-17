require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; // ใช้ค่า PORT จาก .env หรือ 3000 ถ้าไม่มี
const MONGO_URI = process.env.MONGO_URI; // ใช้ค่า MONGO_URI จาก .env

// เชื่อมต่อกับ MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('เชื่อมต่อ MongoDB สำเร็จ'))
.catch(err => console.log(err));

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
});

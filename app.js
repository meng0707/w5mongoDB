require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; // ใช้ค่า PORT จาก .env หรือ 3000 ถ้าไม่มี
const MONGO_URI = process.env.MONGO_URI; // ใช้ค่า MONGO_URI จาก .env

// เชื่อมต่อกับ MongoDB โดยไม่มีการใช้ออปชั่นที่ล้าสมัย
mongoose.connect(MONGO_URI)
    .then(() => console.log('เชื่อมต่อ MongoDB สำเร็จ'))
    .catch(err => console.log(err));

// Middleware เพื่ออ่าน JSON จาก request body
app.use(express.json());

// สร้าง Schema และ Model
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
});

const Product = mongoose.model('Product', ProductSchema);

// POST route เพื่อเพิ่มข้อมูลสินค้า
app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
});

// PUT route เพื่ออัพเดทข้อมูลสินค้า
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description },
            { new: true } // ส่งคืนเอกสารที่อัพเดทแล้ว
        );
        if (!updatedProduct) {
            return res.status(404).send('ไม่พบสินค้า');
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
    }
});

// GET route เพื่อดึงข้อมูลสินค้าทั้งหมด
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // ดึงข้อมูลสินค้าทั้งหมด
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

// GET route เพื่อดึงข้อมูลสินค้าตาม _id
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Request ID: ${id}`); // เพิ่มการ log ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('ไม่พบสินค้า');
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send('ไม่พบสินค้า');
        }
        res.status(200).json({ message: 'ลบสินค้าสำเร็จ', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
});






// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
});

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401); // ส่งค่า 401 ให้กับผู้ใช้เมื่อไม่สามารถยืนยัน Token ได้
    }

    req.user = user; // กำหนดข้อมูลผู้ใช้ใน req.user หากยืนยัน Token ได้ถูกต้อง
    next(); // เรียกฟังก์ชัน next() เพื่อเรียก middleware ถัดไป
  });
}

module.exports = { authenticateToken };


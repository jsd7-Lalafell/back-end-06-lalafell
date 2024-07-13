const { verify } = require("../utils/token");
const User = require("../models/user.model");

const authenticateMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log(authHeader)


    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: true, message: "ไม่ได้รับอนุญาต" });

    const decoded = verify(token);
    const user = await User.findById(decoded.user);
    if (!user)
      return res.status(401).json({ error: true, message: "ไม่พบผู้ใช้" });
    console.log(user)

    req.user = user;
    next();
  } catch (error) {
    console.error(`ข้อผิดพลาดในการยืนยันตัวตน: ${error.message}`);
    return res.status(401).json({ error: true, message: "ไม่ได้รับอนุญาต" });
  }
};

module.exports = { authenticateMiddleware };

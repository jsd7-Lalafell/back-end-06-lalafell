const jwt = require("jsonwebtoken");

const sign = (payload) => {
  console.log("Sign Token", process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h", // ระยะเวลาหมดอายุที่เหมาะสมมากขึ้น
  });
};

const verify = (token) => {
  console.log("Verify Token", process.env.ACCESS_TOKEN_SECRET);
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

module.exports = { sign, verify };

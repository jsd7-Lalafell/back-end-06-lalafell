const jwt = require("jsonwebtoken");

const sign = (payload) => {
  console.log("Sign Token", process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });
};

const verify = (token) => {
  console.log("Verify Token", process.env.ACCESS_TOKEN_SECRET);
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = { sign, verify };


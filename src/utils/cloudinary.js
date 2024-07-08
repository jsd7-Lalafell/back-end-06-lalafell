const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CDR_CLOUD_NAME,
  api_key: process.env.CDR_API_KEY,
  api_secret: process.env.CDR_SECRET,
});

module.exports = cloudinary;

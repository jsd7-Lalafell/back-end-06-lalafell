require("dotenv").config();

const authRoute = require("./src/routes/authRoute");
const addressRoute = require("./src/routes/addressRoute");
const paymentRoute = require("./src/routes/paymentRoute");
const productRoute = require("./src/routes/productRoute");
const userRoute = require("./src/routes/userRoute");
const cartRoute = require("./src/routes/cartRoute");
const orderRoute = require("./src/routes/orderRoute");
const orderHistoryRoute = require("./src/routes/orderHistoryRoute")

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB ✅");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const addressRoute = require("./src/routes/addressRoute");
const paymentRoute = require("./src/routes/paymentRoute");
const productRoute = require("./src/routes/productRoute");
const checkoutRoute = require("./src/routes/checkoutRouter");

//User Authenticate----------------
app.use("/", authRoute);
//User---------------
app.use("/", userRoute);
app.use("/", addressRoute);
app.use("/", paymentRoute);
app.use("/", productRoute);
//Cart----------------------
app.use("/", cartRoute);
//Order---------------------
app.use("/", orderRoute);
//OrderHistory---------------
app.use('/', orderHistoryRoute);
//Checkout
app.use("/", checkoutRoute);

// Default route
app.get("/", (req, res) => {
  res.json({ data: "Response received from the server!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});



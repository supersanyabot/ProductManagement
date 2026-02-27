require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });

app.use(express.json());

app.use("/", productRoutes);
app.use("/", categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
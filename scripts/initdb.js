require("dotenv").config();
const mongoose = require("mongoose");

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

const Category = require("../models/Category");
const Product = require("../models/Product");

const categoriesData = [
    { key: "electronics", name: "Electronics", description: "Electronic devices and gadgets" },
    { key: "fashion", name: "Fashion", description: "Clothes and accessories" },
    { key: "home", name: "Home & Living", description: "Furniture and household items" },
    { key: "beauty", name: "Beauty & Personal Care", description: "Cosmetics and personal care" },
    { key: "sports", name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
    { key: "toys", name: "Toys & Games", description: "Kids toys and board games" },
    { key: "books", name: "Books", description: "Fiction and non-fiction" },
    { key: "groceries", name: "Groceries", description: "Daily groceries and snacks" },
    { key: "automotive", name: "Automotive", description: "Car accessories" },
    { key: "pet", name: "Pet Supplies", description: "Food and accessories for pets" },
    { key: "office", name: "Office Supplies", description: "Stationery and office gadgets" },
    { key: "garden", name: "Garden & Tools", description: "Gardening tools and plants" },
    { key: "music", name: "Music & Audio", description: "Instruments and audio gear" },
    { key: "health", name: "Health", description: "Healthcare products" },
    { key: "baby", name: "Baby & Kids", description: "Baby care products" },
    { key: "travel", name: "Travel", description: "Luggage and travel accessories" },
    { key: "art", name: "Art & Crafts", description: "DIY and art supplies" },
    { key: "gaming", name: "Gaming", description: "Consoles and games" },
    { key: "jewelry", name: "Jewelry", description: "Rings, necklaces, bracelets" },
    { key: "footwear", name: "Footwear", description: "Shoes and sandals" },
];

const productsData = categoriesData.flatMap((category, catIndex) => {
    return Array.from({ length: 20 }).map((_, productIndex) => ({
        name: `${category.name} Product ${productIndex + 1}`,
        price: Math.round(500 + Math.random() * 5000),
        description: `Sample ${category.name.toLowerCase()} product number ${productIndex + 1}.`,
        image: `https://example.com/${category.key}-${productIndex + 1}.jpg`,
        categoryKey: category.key,
    }));
});

(async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB - starting seed...");

        await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
        console.log("Cleared existing products & categories");

        const categoryDocs = await Category.insertMany(
            categoriesData.map(({ key, ...rest }) => rest)
        );

        const categoryMap = {};
        categoryDocs.forEach((doc, index) => {
            categoryMap[categoriesData[index].key] = doc._id;
        });

        const productsToInsert = productsData.map(({ categoryKey, ...rest }) => ({
            ...rest,
            categoryId: categoryMap[categoryKey] || null,
        }));

        await Product.insertMany(productsToInsert);

        console.log("Seed completed successfully");
    } catch (error) {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
})();

const Product = require("../models/Product");

const getProducts = async ({ page = 1, limit = 10, search = "" }) => {
    const query = { isDeleted: false };
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Product.find(query)
            .populate("categoryId", "name description")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }),
        Product.countDocuments(query),
    ]);
    return {
        data,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getProductById = async (id) => {
    return Product.findOne({ _id: id, isDeleted: false }).populate(
        "categoryId",
        "name description"
    );
};

const createProduct = async (payload) => {
    const product = new Product(payload);
    return product.save();
};

const updateProduct = async (id, payload) => {
    return Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: payload },
        { new: true, runValidators: true }
    ).populate("categoryId", "name description");
};

const deleteProduct = async (id, hard = false) => {
    if (hard) {
        return Product.findOneAndDelete({ _id: id });
    }
    return Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
    );
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

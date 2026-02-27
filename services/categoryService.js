const Category = require("../models/Category");

const getCategories = async ({ page = 1, limit = 10, search = "" }) => {
    const query = { isDeleted: false };
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Category.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Category.countDocuments(query),
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

const getCategoryById = async (id) => {
    return Category.findOne({ _id: id, isDeleted: false });
};

const createCategory = async (payload) => {
    const category = new Category(payload);
    return category.save();
};

const updateCategory = async (id, payload) => {
    return Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: payload },
        { new: true, runValidators: true }
    );
};

const deleteCategory = async (id, hard = false) => {
    if (hard) {
        return Category.findOneAndDelete({ _id: id });
    }
    return Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
    );
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

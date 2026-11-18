
const Product = require("../models/product");

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// CREATE PRODUCT
exports.createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
});

// GET ALL PRODUCTS WITH SEARCH, FILTER, SORT AND PAGINATION
exports.getProducts = asyncHandler(async (req, res) => {
    const {
        category,
        search,
        minPrice,
        maxPrice,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10
    } = req.query;

    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } }
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};

        if (minPrice !== undefined) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    const allowedSortFields = [
        "name", "price", "quantity", "createdAt"
    ];

    const sortField = allowedSortFields.includes(sort)
        ? sort
        : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;
    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, Number(limit) || 10));

    const products = await Product.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit);

    const total = await Product.countDocuments(filter);

    res.json({
        success: true,
        total,
        page: currentPage,
        pages: Math.ceil(total / pageLimit),
        products
    });
});

// GET SINGLE PRODUCT
exports.getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json({ success: true, product });
});

// UPDATE PRODUCT
exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

// DELETE PRODUCT
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product deleted successfully"
    });
});

// RESTOCK PRODUCT
exports.restockProduct = asyncHandler(async (req, res) => {
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            message: "Restock quantity must be a positive integer"
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { quantity } },
        { new: true, runValidators: true }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Stock updated successfully",
        product
    });
});

// SELL PRODUCT
exports.sellProduct = asyncHandler(async (req, res) => {
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            message: "Sale quantity must be a positive integer"
        });
    }

    const product = await Product.findOneAndUpdate(
        {
            _id: req.params.id,
            quantity: { $gte: quantity }
        },
        {
            $inc: { quantity: -quantity }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        const exists = await Product.exists({ _id: req.params.id });

        return res.status(exists ? 400 : 404).json({
            message: exists
                ? "Insufficient stock"
                : "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Sale completed successfully",
        product
    });
});

// GET LOW STOCK PRODUCTS
exports.getLowStock = asyncHandler(async (req, res) => {
    const products = await Product.find({
        $expr: {
            $lte: ["$quantity", "$lowStockThreshold"]
        }
    });

    res.json({
        success: true,
        count: products.length,
        products
    });
});

// CATEGORY SUMMARY REPORT
exports.getCategorySummary = asyncHandler(async (req, res) => {
    const summary = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                totalProducts: { $sum: 1 },
                totalQuantity: { $sum: "$quantity" },
                totalValue: {
                    $sum: {
                        $multiply: ["$price", "$quantity"]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                totalProducts: 1,
                totalQuantity: 1,
                totalValue: 1
            }
        },
        {
            $sort: { category: 1 }
        }
    ]);

    res.json({
        success: true,
        summary
    });
});

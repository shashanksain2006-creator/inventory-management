
const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    getLowStock,
    getCategorySummary
} = require("../controllers/productController");

// Create a product
router.post("/", createProduct);

// Get low-stock products
router.get("/low-stock", getLowStock);

// Get category-wise summary
router.get("/category-summary", getCategorySummary);

// Get all products (with filters and pagination)
router.get("/", getProducts);

// Restock a product
router.patch("/:id/restock", restockProduct);

// Sell a product
router.patch("/:id/sale", sellProduct);

// Get product by ID
router.get("/:id", getProductById);

// Update a product
router.put("/:id", updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

module.exports = router;

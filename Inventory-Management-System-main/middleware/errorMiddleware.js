const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicate SKU" });
    }

    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message || "Internal Server Error" });
};

module.exports = errorHandler;
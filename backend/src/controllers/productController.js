const productService = require('../services/productService');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword;

        const result = await productService.findAllProducts({ keyword, pageSize, pageNumber });
        res.json(result);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.findProductById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        // If it's a CastError (invalid ID format), usually 404 is better than 500, but let generic handler decide or handle explicitly
        if (error.name === 'CastError') {
            res.status(404);
        } else if (!res.statusCode || res.statusCode === 200) {
            res.status(404);
        }
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productService.createProduct(req.body);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProductById(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.removeProductById(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

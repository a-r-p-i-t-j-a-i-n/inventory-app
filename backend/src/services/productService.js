const Product = require('../models/Product');

const findAllProducts = async ({ keyword, pageSize, pageNumber }) => {
    const query = keyword
        ? {
            name: {
                $regex: keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...query });
    const products = await Product.find({ ...query })
        .limit(pageSize)
        .skip(pageSize * (pageNumber - 1));

    return { products, page: pageNumber, pages: Math.ceil(count / pageSize), count };
};

const findProductById = async (id) => {
    return await Product.findById(id);
};

const createProduct = async (productData) => {
    const { sku } = productData;
    const productExists = await Product.findOne({ sku });
    if (productExists) {
        throw new Error('Product with this SKU already exists');
    }

    const product = new Product(productData);
    return await product.save();
};

const updateProductById = async (id, updateData) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error('Product not found');
    }

    Object.assign(product, updateData);
    return await product.save();
};

const removeProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    await product.deleteOne();
    return { message: 'Product removed' };
};

module.exports = {
    findAllProducts,
    findProductById,
    createProduct,
    updateProductById,
    removeProductById,
};

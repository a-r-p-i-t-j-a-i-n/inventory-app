import { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation } from '../features/products/productsApiSlice';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Products.module.css';
import SkeletonLoader from '../components/SkeletonLoader';

const Products = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });
    const [deleteProduct] = useDeleteProductMutation();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    
    const { userInfo } = useSelector((state) => state.auth);
    const isAdmin = userInfo?.role === 'admin';

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteProduct(id);
            toast.success('Product deleted');
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditProduct(null);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={styles.searchBox}
                />
                {isAdmin && (
                    <button onClick={handleAdd} className={styles.addButton}>
                        + Add Product
                    </button>
                )}
            </div>

            {isLoading ? (
                <SkeletonLoader count={8} height="50px" />
            ) : error ? (
                <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Error loading products</div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.products?.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.category}</td>
                                        <td>${product.price}</td>
                                        <td style={{ color: product.quantity <= product.lowStockThreshold ? 'red' : 'inherit', fontWeight: product.quantity <= product.lowStockThreshold ? 'bold' : 'normal' }}>
                                            {product.quantity}
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <button onClick={() => handleEdit(product)} className={styles.actionBtn}>
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className={styles.pagination}>
                        {[...Array(data?.pages).keys()].map((x) => (
                            <button
                                key={x + 1}
                                onClick={() => setPageNumber(x + 1)}
                                className={`${styles.pageBtn} ${pageNumber === x + 1 ? styles.activePage : ''}`}
                            >
                                {x + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {isModalOpen && (
                <ProductModal 
                    product={editProduct} 
                    onClose={() => setIsModalOpen(false)} 
                    createProduct={createProduct}
                    updateProduct={updateProduct}
                />
            )}
        </div>
    );
};

const ProductModal = ({ product, onClose, createProduct, updateProduct }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || '',
        price: product?.price || 0,
        lowStockThreshold: product?.lowStockThreshold || 5, // Default threshold
        description: product?.description || '',
         // Not editing quantity here, that's for Stock Adjustment
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product) {
                await updateProduct({ _id: product._id, ...formData }).unwrap();
                toast.success('Product updated successfully');
            } else {
                await createProduct({ ...formData, quantity: 0 }).unwrap(); // Init with 0 stock
                toast.success('Product created successfully');
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Error saving product');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Name</label>
                        <input className={styles.formInput} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>SKU</label>
                        <input className={styles.formInput} value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required disabled={!!product} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Category</label>
                        <input className={styles.formInput} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                         <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.formLabel}>Price</label>
                            <input type="number" className={styles.formInput} value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
                        </div>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.formLabel}>Low Stock Alert At</label>
                            <input type="number" className={styles.formInput} value={formData.lowStockThreshold} onChange={(e) => setFormData({...formData, lowStockThreshold: Number(e.target.value)})} required />
                        </div>
                    </div>
                     <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Description</label>
                        <textarea className={styles.formInput} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.addButton}>{product ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Products;

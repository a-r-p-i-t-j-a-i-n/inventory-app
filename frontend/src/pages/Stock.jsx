import { useState } from 'react';
import { useGetProductsQuery } from '../features/products/productsApiSlice';
import { useAddStockMovementMutation } from '../features/inventory/stockApiSlice';
import styles from './Stock.module.css'; // Use new dedicated styles
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Stock = () => {
    const [productId, setProductId] = useState('');
    const [type, setType] = useState('IN');
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');

    const { data } = useGetProductsQuery({ pageNumber: 1, keyword: '' }); 

    const [addMovement, { isLoading }] = useAddStockMovementMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const isAdmin = userInfo?.role === 'admin';

    if (!isAdmin) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Only Admins can manage stock.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addMovement({ productId, type, quantity: Number(quantity), reason }).unwrap();
            toast.success('Stock updated successfully');
            setProductId('');
            setQuantity(1);
            setReason('');
        } catch (err) {
            toast.error(err?.data?.message || 'Error updating stock');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.stockCard}>
                <h1 className={styles.title}>Stock Adjustment</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Select Product</label>
                        <select 
                            className={styles.select} 
                            value={productId} 
                            onChange={(e) => setProductId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Product --</option>
                            {data?.products?.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.name} (Current Stock: {p.quantity})
                                </option>
                            ))}
                        </select>
                        <div className={styles.helperText}>* Displaying first page of products</div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Movement Type</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    value="IN" 
                                    className={styles.radioInput}
                                    checked={type === 'IN'} 
                                    onChange={(e) => setType(e.target.value)} 
                                />
                                <span>Stock IN (Purchase)</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    value="OUT" 
                                    className={styles.radioInput}
                                    checked={type === 'OUT'} 
                                    onChange={(e) => setType(e.target.value)} 
                                />
                                <span>Stock OUT (Sale/Damage)</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quantity</label>
                        <input 
                            type="number" 
                            min="1" 
                            className={styles.input} 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            required 
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div className={styles.formGroup}>
                         <label className={styles.label}>Reason / Reference</label>
                         <input 
                            type="text" 
                            className={styles.input} 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                            placeholder="e.g. PO-123, Damaged, Sale" 
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Submit Adjustment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Stock;

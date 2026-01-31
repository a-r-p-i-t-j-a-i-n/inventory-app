import { useGetDashboardStatsQuery } from '../features/inventory/stockApiSlice';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

    if (isLoading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error loading dashboard data.</div>;

    return (
        <div>
            <h1 className={styles.dashboardHeader}>Dashboard</h1>
            
            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Total Products</span>
                    <span className={styles.cardValue}>{stats?.totalProducts || 0}</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Low Stock Items</span>
                    <span className={styles.cardValue} style={{ color: stats?.lowStockCount > 0 ? '#dc2626' : 'inherit' }}>
                        {stats?.lowStockCount || 0}
                    </span>
                </div>
                {/* Could add total value or other stats here */}
            </div>

            <section>
                <h2 className={styles.sectionTitle}>Recent Stock Movements</h2>
                <div className={styles.recentMoves}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Reason</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentMovements?.map((move) => (
                                <tr key={move._id}>
                                    <td>{move.product?.name || 'Unknown Product'}</td>
                                    <td>
                                        <span className={move.type === 'IN' ? styles.inBadge : styles.outBadge}>
                                            {move.type}
                                        </span>
                                    </td>
                                    <td>{move.quantity}</td>
                                    <td>{move.reason || '-'}</td>
                                    <td>{new Date(move.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {stats?.recentMovements?.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No recent movements</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

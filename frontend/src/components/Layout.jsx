import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LayoutDashboard, Package, LogOut, ArrowRightLeft } from 'lucide-react';
import styles from './Layout.module.css';

const Layout = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className={styles.layoutContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>IMS Admin</div>
                <nav className={styles.nav}>
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </div>
                    </NavLink>
                    <NavLink 
                        to="/products" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                    >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Package size={20} />
                            Products
                        </div>
                    </NavLink>
                    <NavLink 
                        to="/stock" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                    >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ArrowRightLeft size={20} />
                            Stock
                        </div>
                    </NavLink>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h2>Welcome, {userInfo?.username}</h2>
                    <div className={styles.userInfo}>
                        <span>{userInfo?.role}</span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={16} />
                                Logout
                            </div>
                        </button>
                    </div>
                </header>
                <div className={styles.pageContainer}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

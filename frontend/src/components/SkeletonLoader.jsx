import styles from './SkeletonLoader.module.css';

const SkeletonLoader = ({ count = 5, height = '40px' }) => {
    return (
        <div className={styles.container}>
            {[...Array(count)].map((_, i) => (
                <div 
                    key={i} 
                    className={styles.skeleton} 
                    style={{ height }}
                />
            ))}
        </div>
    );
};

export default SkeletonLoader;

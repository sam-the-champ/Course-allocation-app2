import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LecturerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.logo}>CA</span>
          <span style={styles.title}>Course Allocation System</span>
        </div>
        <div style={styles.right}>
          <span style={styles.name}>{user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  shell: { minHeight: '100vh', background: 'var(--surface-2)' },
  header: { background: 'var(--primary)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo: { width: 36, height: 36, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: '0.9rem' },
  title: { fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700, fontSize: '1rem' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  name: { color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' },
  main: { padding: '2rem', maxWidth: 1000, margin: '0 auto' },
};

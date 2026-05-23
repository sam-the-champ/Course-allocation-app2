import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/lecturers', label: 'Lecturers', icon: '👤' },
  { to: '/admin/courses', label: 'Courses', icon: '📚' },
  { to: '/admin/allocations', label: 'Allocations', icon: '🗂' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.shell}>
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 220 }}>
        <div style={styles.sideTop}>
          <div style={styles.logoBox}>
            <span style={styles.logoIcon}>CA</span>
            {!collapsed && <span style={styles.logoText}>CAS Admin</span>}
          </div>
          <button style={styles.collapseBtn} onClick={() => setCollapsed(c => !c)} title="Toggle sidebar">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav style={styles.nav}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navActive : {}) })}
            >
              <span style={styles.navIcon}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sideBottom}>
          {!collapsed && <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <div style={styles.userName}>{user?.username}</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </div>}
          <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <span>⎋</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--surface-2)' },
  sidebar: {
    background: 'var(--primary-dark)', display: 'flex', flexDirection: 'column',
    transition: 'width 0.2s ease', overflow: 'hidden', flexShrink: 0,
    position: 'sticky', top: 0, height: '100vh',
  },
  sideTop: { padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  logoBox: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoIcon: { width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: '#fff', flexShrink: 0 },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem', whiteSpace: 'nowrap' },
  collapseBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 },
  nav: { flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.15s', textDecoration: 'none', whiteSpace: 'nowrap' },
  navActive: { background: 'rgba(200,150,62,0.18)', color: 'var(--accent-light)' },
  navIcon: { fontSize: '1rem', flexShrink: 0, width: 20, textAlign: 'center' },
  sideBottom: { padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  userAvatar: { width: 34, height: 34, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 },
  userName: { color: '#fff', fontSize: '0.85rem', fontWeight: 600 },
  userRole: { color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.55rem 0.75rem', background: 'rgba(192,57,43,0.18)', border: 'none', borderRadius: 8, color: '#ff8a80', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.15s' },
  main: { flex: 1, padding: '2rem', overflowY: 'auto' },
};

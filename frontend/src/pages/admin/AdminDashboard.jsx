import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api';

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...styles.stat, borderTop: `4px solid ${color}` }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={{ ...styles.statValue, color }}>{value ?? '—'}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.username} 👋</h1>
        <p>Here's an overview of the course allocation system.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? <div className="spinner" /> : (
        <div style={styles.grid}>
          <StatCard label="Total Lecturers"     value={stats?.totalLecturers}    color="var(--primary)"  icon="👤" />
          <StatCard label="Total Courses"       value={stats?.totalCourses}      color="var(--accent)"   icon="📚" />
          <StatCard label="Allocated Courses"   value={stats?.allocatedCourses}  color="var(--success)"  icon="✅" />
          <StatCard label="Unallocated Courses" value={stats?.unallocatedCourses} color="var(--danger)"  icon="⚠" />
        </div>
      )}

      <div style={styles.info}>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Quick Guide</h3>
          <ul style={{ color: 'var(--text-2)', lineHeight: 2.2, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
            <li>Add lecturers first under <strong>Lecturers</strong></li>
            <li>Create course records under <strong>Courses</strong></li>
            <li>Assign courses to lecturers under <strong>Allocations</strong></li>
            <li>Lecturers log in to view their own timetable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' },
  stat: { background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow)' },
  statIcon: { fontSize: '1.8rem', marginBottom: '0.75rem' },
  statValue: { fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { color: 'var(--text-3)', fontSize: '0.82rem', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' },
  info: { marginTop: '0.5rem' },
};

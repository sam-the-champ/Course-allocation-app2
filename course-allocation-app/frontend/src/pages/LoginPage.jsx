import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin, lecturerLogin } from '../api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [form, setForm] = useState({ username: '', password: '', lecturerId: '', surname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (role === 'admin') {
        res = await adminLogin({ username: form.username, password: form.password });
      } else {
        res = await lecturerLogin({ lecturerId: form.lecturerId, surname: form.surname });
      }
      const { token, user } = res.data;
      login(token, user);
      navigate(role === 'admin' ? '/admin' : '/lecturer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>CA</div>
          <h1 style={styles.brandName}>Course Allocation<br />System</h1>
          <p style={styles.brandSub}>Department Portal — Manage lecturers, courses, and timetable allocations in one place.</p>
        </div>
        <div style={styles.pattern} aria-hidden="true" />
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Select your role to continue</p>

          <div style={styles.tabs}>
            {['admin', 'lecturer'].map((r) => (
              <button
                key={r}
                style={{ ...styles.tab, ...(role === r ? styles.tabActive : {}) }}
                onClick={() => { setRole(r); setError(''); }}
                type="button"
              >
                {r === 'admin' ? '⚙ Admin' : '👤 Lecturer'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {error && <div className="alert alert-error">{error}</div>}

            {role === 'admin' ? (
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input name="username" value={form.username} onChange={handle} placeholder="Enter username" required autoFocus />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" value={form.password} onChange={handle} placeholder="Enter password" required />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Lecturer ID</label>
                  <input name="lecturerId" value={form.lecturerId} onChange={handle} placeholder="e.g. LEC/001" required autoFocus />
                </div>
                <div className="form-group">
                  <label>Surname</label>
                  <input name="surname" value={form.surname} onChange={handle} placeholder="Enter your surname" required />
                </div>
              </>
            )}

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'var(--primary)', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden',
  },
  brand: { position: 'relative', zIndex: 1 },
  logo: {
    width: 56, height: 56, background: 'var(--accent)', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#fff',
    marginBottom: '1.5rem',
  },
  brandName: { color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-display)', lineHeight: 1.25, marginBottom: '1rem' },
  brandSub: { color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 320 },
  pattern: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(200,150,62,0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  right: {
    width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem', background: 'var(--surface-2)',
  },
  card: {
    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2.5rem',
    width: '100%', boxShadow: 'var(--shadow-lg)',
  },
  title: { fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1.75rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' },
  tab: {
    flex: 1, padding: '0.6rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)',
    background: 'transparent', color: 'var(--text-2)', fontFamily: 'var(--font-body)',
    fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
  },
  tabActive: { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' },
};

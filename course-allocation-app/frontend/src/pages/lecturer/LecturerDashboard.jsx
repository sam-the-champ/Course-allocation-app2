import { useEffect, useState } from 'react';
import { getMyProfile, getMyAllocations } from '../../api';

export default function LecturerDashboard() {
  const [profile, setProfile] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyProfile(), getMyAllocations()])
      .then(([p, a]) => { setProfile(p.data.data); setAllocations(a.data.data); })
      .catch(() => setError('Failed to load your data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Your profile and allocated courses</p>
      </div>

      {profile && (
        <div className="card" style={styles.profile}>
          <div style={styles.avatar}>{profile.title?.[0] || profile.firstname?.[0]}</div>
          <div>
            <h2 style={styles.name}>{profile.title} {profile.firstname} {profile.surname}</h2>
            <p style={styles.dept}>{profile.department}</p>
            <div style={styles.details}>
              <span>📧 {profile.email}</span>
              {profile.phoneNumber && <span>📞 {profile.phoneNumber}</span>}
              <span>🪪 {profile.lecturerId}</span>
            </div>
          </div>
        </div>
      )}

      <h2 style={styles.sectionTitle}>My Allocated Courses ({allocations.length})</h2>

      {allocations.length === 0 ? (
        <div className="card"><div className="empty-state"><p>No courses allocated to you yet.</p></div></div>
      ) : (
        <div style={styles.grid}>
          {allocations.map(a => (
            <div key={a._id} className="card" style={styles.courseCard}>
              <div style={styles.courseHeader}>
                <span className="badge badge-yellow">{a.course.courseCode}</span>
                <span className={`badge ${a.semester === 'First' ? 'badge-blue' : 'badge-green'}`}>{a.semester} Semester</span>
              </div>
              <h3 style={styles.courseTitle}>{a.course.courseTitle}</h3>
              <div style={styles.courseMeta}>
                <div style={styles.metaItem}><span style={styles.metaLabel}>Level</span><span>{a.level}</span></div>
                <div style={styles.metaItem}><span style={styles.metaLabel}>Units</span><span>{a.course.unit}</span></div>
                <div style={styles.metaItem}><span style={styles.metaLabel}>Day</span><span>{a.classDate}</span></div>
                <div style={styles.metaItem}><span style={styles.metaLabel}>Time</span><span>{a.classTime}</span></div>
                <div style={styles.metaItem}><span style={styles.metaLabel}>Session</span><span>{a.academicSession}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  profile: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' },
  avatar: { width: 64, height: 64, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 },
  name: { fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.2rem' },
  dept: { color: 'var(--accent)', fontWeight: 500, marginBottom: '0.5rem' },
  details: { display: 'flex', gap: '1.25rem', color: 'var(--text-2)', fontSize: '0.88rem', flexWrap: 'wrap' },
  sectionTitle: { fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' },
  courseCard: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  courseHeader: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  courseTitle: { fontSize: '1rem', color: 'var(--text)', fontFamily: 'var(--font-display)' },
  courseMeta: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' },
};

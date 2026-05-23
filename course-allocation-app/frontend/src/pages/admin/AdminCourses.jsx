import { useEffect, useState } from 'react';
import { getCourses, addCourse, deleteCourse } from '../../api';

const EMPTY = { courseCode: '', courseTitle: '', semester: '', unit: '', description: '' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => getCourses().then(r => setCourses(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await addCourse({ ...form, unit: Number(form.unit) });
      setSuccess('Course added successfully.'); setShowModal(false); setForm(EMPTY); load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add course.');
    } finally { setSaving(false); }
  };

  const remove = async (id, title) => {
    if (!confirm(`Remove "${title}"?`)) return;
    try { await deleteCourse(id); load(); }
    catch { alert('Failed to delete course.'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Courses</h1>
          <p>Manage available courses</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(''); }}>+ Add Course</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="spinner" /> : courses.length === 0 ? (
          <div className="empty-state"><p>No courses yet. Add the first one.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Code</th><th>Title</th><th>Semester</th><th>Units</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td><span className="badge badge-yellow">{c.courseCode}</span></td>
                  <td><strong>{c.courseTitle}</strong></td>
                  <td>{c.semester}</td>
                  <td>{c.unit}</td>
                  <td style={{ color: 'var(--text-2)', maxWidth: 200 }}>{c.description || '—'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => remove(c._id, c.courseTitle)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Add Course</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group"><label>Course Code *</label><input name="courseCode" value={form.courseCode} onChange={handle} placeholder="e.g. CSC301" required /></div>
              <div className="form-group"><label>Course Title *</label><input name="courseTitle" value={form.courseTitle} onChange={handle} placeholder="e.g. Data Structures" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group"><label>Semester *</label>
                  <select name="semester" value={form.semester} onChange={handle} required>
                    <option value="">Select</option>
                    <option>First</option><option>Second</option>
                  </select>
                </div>
                <div className="form-group"><label>Units *</label>
                  <input name="unit" type="number" min="1" max="6" value={form.unit} onChange={handle} required />
                </div>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handle} rows={3} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
};

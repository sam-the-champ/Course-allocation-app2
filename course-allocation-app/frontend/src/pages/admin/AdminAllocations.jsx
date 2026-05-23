import { useEffect, useState } from 'react';
import { getAllocations, allocateCourse, deleteAllocation, getLecturers, getCourses } from '../../api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const EMPTY = { lecturerId: '', courseId: '', level: '', semester: '', classDate: '', classTime: '', academicSession: '' };

export default function AdminAllocations() {
  const [allocations, setAllocations] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const [a, l, c] = await Promise.all([getAllocations(), getLecturers(), getCourses()]);
    setAllocations(a.data.data);
    setLecturers(l.data.data);
    setCourses(c.data.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await allocateCourse(form);
      setSuccess('Course allocated successfully.'); setShowModal(false); setForm(EMPTY); load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate course.');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this allocation?')) return;
    try { await deleteAllocation(id); load(); }
    catch { alert('Failed to remove allocation.'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Allocations</h1>
          <p>Assign courses to lecturers</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(''); }}>+ Allocate Course</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="spinner" /> : allocations.length === 0 ? (
          <div className="empty-state"><p>No allocations yet.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Lecturer</th><th>Course</th><th>Level</th><th>Semester</th><th>Day</th><th>Time</th><th>Session</th><th></th></tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a._id}>
                  <td><strong>{a.lecturer?.title} {a.lecturer?.firstname} {a.lecturer?.surname}</strong><br /><small style={{ color: 'var(--text-3)' }}>{a.lecturer?.lecturerId}</small></td>
                  <td><span className="badge badge-yellow">{a.course?.courseCode}</span><br /><small>{a.course?.courseTitle}</small></td>
                  <td>{a.level}</td>
                  <td><span className={`badge ${a.semester === 'First' ? 'badge-blue' : 'badge-green'}`}>{a.semester}</span></td>
                  <td>{a.classDate}</td>
                  <td>{a.classTime}</td>
                  <td style={{ color: 'var(--text-2)' }}>{a.academicSession}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => remove(a._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Allocate Course</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group"><label>Lecturer *</label>
                <select name="lecturerId" value={form.lecturerId} onChange={handle} required>
                  <option value="">Select lecturer</option>
                  {lecturers.map(l => <option key={l._id} value={l._id}>{l.title} {l.firstname} {l.surname} ({l.lecturerId})</option>)}
                </select>
              </div>
              <div className="form-group"><label>Course *</label>
                <select name="courseId" value={form.courseId} onChange={handle} required>
                  <option value="">Select course</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode} — {c.courseTitle}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group"><label>Level *</label>
                  <select name="level" value={form.level} onChange={handle} required>
                    <option value="">Select</option>
                    {['100','200','300','400','HND1','HND2'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Semester *</label>
                  <select name="semester" value={form.semester} onChange={handle} required>
                    <option value="">Select</option>
                    <option>First</option><option>Second</option>
                  </select>
                </div>
                <div className="form-group"><label>Class Day *</label>
                  <select name="classDate" value={form.classDate} onChange={handle} required>
                    <option value="">Select</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Class Time *</label>
                  <input name="classTime" value={form.classTime} onChange={handle} placeholder="e.g. 10:00 AM" required />
                </div>
              </div>
              <div className="form-group"><label>Academic Session *</label>
                <input name="academicSession" value={form.academicSession} onChange={handle} placeholder="e.g. 2024/2025" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Allocate'}</button>
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

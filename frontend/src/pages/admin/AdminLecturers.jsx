import { useEffect, useState } from 'react';
import { getLecturers, addLecturer, deleteLecturer } from '../../api';

const EMPTY = { lecturerId: '', surname: '', firstname: '', email: '', department: '', phoneNumber: '', gender: '', title: '' };

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => getLecturers().then(r => setLecturers(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await addLecturer(form);
      setSuccess('Lecturer added successfully.');
      setShowModal(false); setForm(EMPTY); load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lecturer.');
    } finally { setSaving(false); }
  };

  const remove = async (id, name) => {
    if (!confirm(`Remove ${name}? Their allocations will also be deleted.`)) return;
    try { await deleteLecturer(id); load(); }
    catch { alert('Failed to delete lecturer.'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Lecturers</h1>
          <p>Manage department lecturers</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(''); }}>+ Add Lecturer</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="spinner" /> : lecturers.length === 0 ? (
          <div className="empty-state"><p>No lecturers yet. Add your first one.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Department</th><th>Email</th><th>Phone</th><th></th></tr>
            </thead>
            <tbody>
              {lecturers.map(l => (
                <tr key={l._id}>
                  <td><span className="badge badge-blue">{l.lecturerId}</span></td>
                  <td><strong>{l.title} {l.firstname} {l.surname}</strong></td>
                  <td>{l.department}</td>
                  <td style={{ color: 'var(--text-2)' }}>{l.email}</td>
                  <td style={{ color: 'var(--text-3)' }}>{l.phoneNumber || '—'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(l._id, `${l.firstname} ${l.surname}`)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Add Lecturer</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={submit}>
              <div style={styles.grid2}>
                <div className="form-group"><label>Lecturer ID *</label><input name="lecturerId" value={form.lecturerId} onChange={handle} placeholder="e.g. LEC/001" required /></div>
                <div className="form-group"><label>Title</label>
                  <select name="title" value={form.title} onChange={handle}>
                    <option value="">Select</option>
                    {['Prof','Dr','Mr','Mrs','Ms'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>First Name *</label><input name="firstname" value={form.firstname} onChange={handle} required /></div>
                <div className="form-group"><label>Surname *</label><input name="surname" value={form.surname} onChange={handle} required /></div>
                <div className="form-group"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handle} required /></div>
                <div className="form-group"><label>Phone</label><input name="phoneNumber" value={form.phoneNumber} onChange={handle} /></div>
                <div className="form-group"><label>Department *</label><input name="department" value={form.department} onChange={handle} required /></div>
                <div className="form-group"><label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handle}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Lecturer'}</button>
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
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' },
};

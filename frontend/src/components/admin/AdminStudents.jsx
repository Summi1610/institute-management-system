import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ username: '', email: '', password: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const [allRes, pendingRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/pending-students')
      ]);
      setStudents(allRes.data);
      setPending(pendingRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', {
        username: newStudent.username,
        email: newStudent.email,
        password: newStudent.password,
        role: 'ROLE_STUDENT'
      });
      setNewStudent({ username: '', email: '', password: '' });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      alert('Failed to register student');
    }
  };

  const handleStatus = async (id, verify) => {
    const endpoint = verify ? `/admin/verify-student/${id}` : `/admin/revoke-student/${id}`;
    await api.post(endpoint);
    fetchStudents();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 text-sm mt-1">Enroll, verify, and organize your academic cohort.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-3 rounded-xl font-headline font-bold text-sm shadow-[0px_12px_32px_rgba(53,37,205,0.15)] flex items-center gap-2 hover:scale-[1.02] transition-transform">
          <span className="material-symbols-outlined">{showForm ? 'close' : 'person_add'}</span>
          {showForm ? 'Close Form' : '+ Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-primary p-8 rounded-2xl text-white mb-8 shadow-xl">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Username</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newStudent.username} onChange={e => setNewStudent({ ...newStudent, username: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Email</label>
              <input type="email" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Initial Password</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newStudent.password} onChange={e => setNewStudent({ ...newStudent, password: e.target.value })} required />
            </div>
            <div className="md:col-span-3 text-right">
              <button type="submit" className="bg-white text-primary px-8 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Register Student</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface-container-lowest p-5 rounded-2xl mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-lg">
            <span className="material-symbols-outlined text-slate-400 text-lg">filter_list</span>
            <span className="text-sm font-semibold text-slate-700">Filter by Batch:</span>
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 p-0 cursor-pointer">
              <option>All Active Batches</option>
            </select>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full uppercase tracking-wider">All Students ({students.length})</span>
            <span className="px-3 py-1 bg-surface-container-high text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider">Pending ({pending.length})</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-y-1 px-4">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="py-4 px-6 text-[11px] font-label font-bold uppercase tracking-widest text-slate-500 rounded-l-xl">Student Name</th>
              <th className="py-4 px-6 text-[11px] font-label font-bold uppercase tracking-widest text-slate-500">Email</th>
              <th className="py-4 px-6 text-[11px] font-label font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th className="py-4 px-6 text-[11px] font-label font-bold uppercase tracking-widest text-slate-500 rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="before:block before:h-2">
            {pending.map(s => (
              <tr key={s.id} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-xs">
                      {s.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.username}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Student ID: AT-{s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-slate-500">{s.email}</span></td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Pending
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button onClick={() => handleStatus(s.id, true)} className="bg-white border border-outline-variant text-primary px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    Verify
                  </button>
                </td>
              </tr>
            ))}
            {students.filter(s => s.isApproved).map(s => (
              <tr key={s.id} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {s.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.username}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Student ID: AT-{s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-slate-500">{s.email}</span></td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F9F0] text-[#006E4B] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006E4B]"></span>
                    Approved
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleStatus(s.id, false)} className="p-2 text-slate-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;

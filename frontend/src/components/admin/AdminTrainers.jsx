import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { PerformanceCard } from './AdminShared';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ username: '', email: '', password: '', role: 'ROLE_TRAINER' });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    const res = await api.get('/admin/trainers');
    setTrainers(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/trainers', newTrainer);
      setNewTrainer({ username: '', email: '', password: '', role: 'ROLE_TRAINER' });
      setShowForm(false);
      fetchTrainers();
    } catch (err) {
      alert('Failed to onboard trainer');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface headline tracking-tight">Manage Trainers</h2>
          <p className="text-slate-500 text-sm mt-2">Onboard faculty, review trainer profiles, and monitor instructional capacity.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-[0px_12px_32px_rgba(53,37,205,0.15)] active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Close Form' : 'Add New Trainer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-primary p-8 rounded-2xl text-white mb-8 shadow-xl">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80 tracking-widest">Username</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newTrainer.username} onChange={e => setNewTrainer({ ...newTrainer, username: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80 tracking-widest">Email</label>
              <input type="email" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newTrainer.email} onChange={e => setNewTrainer({ ...newTrainer, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80 tracking-widest">Initial Password</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none transition-all" value={newTrainer.password} onChange={e => setNewTrainer({ ...newTrainer, password: e.target.value })} required />
            </div>
            <div className="md:col-span-3 text-right">
              <button type="submit" className="bg-white text-primary px-8 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Register & Onboard</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_12px_48px_rgba(0,0,0,0.03)] border border-outline-variant/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 text-[11px] font-bold font-label uppercase tracking-widest text-slate-500">Trainer Details</th>
              <th className="px-8 py-5 text-[11px] font-bold font-label uppercase tracking-widest text-slate-500">Contact Email</th>
              <th className="px-8 py-5 text-[11px] font-bold font-label uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-8 py-5 text-[11px] font-bold font-label uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {trainers.map(t => (
              <tr key={t.id} className="group hover:bg-surface-container-low/30 dark:hover:bg-transparent transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary font-bold">
                      {t.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{t.username}</p>
                      <p className="text-sm text-slate-500 font-body">ID: TR-{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6"><span className="text-sm font-semibold text-slate-700">{t.email}</span></td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F9F0] text-[#006E4B] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006E4B]"></span>
                    Active
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_12px_48px_rgba(0,0,0,0.02)] border border-outline-variant/5">
          <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">insights</span>
            Faculty Performance Overview
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <PerformanceCard title="Total Active" value={trainers.length} trend="+4 this month" trendColor="text-[#005338]" icon="trending_up" />
            <PerformanceCard title="Session Hours" value="1,240" trend="Avg. 45h/trainer" trendColor="text-[#005338]" icon="schedule" />
            <PerformanceCard title="Student Rating" value="4.9" trend="Top in Class" trendColor="text-[#005338]" icon="star" />
          </div>
        </div>
        <div className="col-span-4 bg-primary-container p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline text-xl font-bold mb-6">Course Allocation</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <span className="material-symbols-outlined mt-1">auto_awesome</span>
                <div>
                  <p className="text-sm font-bold">New Trainer Onboarded</p>
                  <p className="text-xs text-on-primary-container/80 mt-1">Recently added {trainers.length > 0 ? trainers[trainers.length - 1].username : 'new faculty'}.</p>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-white text-primary font-bold rounded-xl active:scale-95 transition-transform">
              Manage Vacancies
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrainers;

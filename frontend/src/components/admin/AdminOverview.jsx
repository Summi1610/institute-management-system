import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { QuickAction, StatCard } from './AdminShared';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    trainers: 0,
    batches: 0,
    courses: 0
  });
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [s, t, b, c, p] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin/trainers'),
          api.get('/admin/batches'),
          api.get('/admin/courses'),
          api.get('/admin/pending-students')
        ]);
        setStats({
          students: s.data.length,
          trainers: t.data.length,
          batches: b.data.length,
          courses: c.data.length
        });
        setPending(p.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.post(`/admin/verify-student/${id}`);
      const p = await api.get('/admin/pending-students');
      setPending(p.data.slice(0, 4));
      const s = await api.get('/admin/students');
      setStats(prev => ({ ...prev, students: s.data.length }));
    } catch (err) {
      console.error('Verification failed', err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
        <p className="text-slate-500 font-body mt-1">Overview of the CPV Management System performance and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={stats.students} icon="history" trend="+12.5%" trendIcon="trending_up" />
        <StatCard title="Total Trainers" value={stats.trainers} subtitle="98% Active rate" icon="check_circle" />
        <StatCard title="Total Batches" value={stats.batches} subtitle="Active academic groups" icon="schedule" />
        <StatCard title="Total Courses" value={stats.courses} subtitle="Curricula available" icon="star" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)] overflow-hidden">
            <div className="px-8 py-6 border-b border-transparent bg-surface-container-low flex justify-between items-center">
              <h4 className="font-headline font-bold text-slate-900">Recent Student Verifications</h4>
              <Link to="/admin/students" className="text-primary text-xs font-semibold hover:underline">View All</Link>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-separate border-spacing-y-1 px-4">
                <thead>
                  <tr className="text-slate-500 font-body uppercase tracking-wider text-[11px]">
                    <th className="px-4 py-4 font-semibold">Name</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  {pending.map(s => (
                    <tr key={s.id} className="group hover:bg-surface-container-low transition-colors rounded-lg">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                          {s.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900">{s.username}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{s.email}</td>
                      <td className="px-4 py-4">
                        <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[11px] font-bold">Pending</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => handleVerify(s.id)} className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-container transition-all active:scale-95">
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pending.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-500 italic">No pending verifications</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-primary bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl shadow-[0px_12px_32px_rgba(53,37,205,0.1)] text-white relative overflow-hidden mb-8">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <h4 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span>
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 gap-4 relative z-10">
              <QuickAction icon="person_add" title="Add Student" subtitle="Register a new student" onClick={() => navigate('/admin/students')} />
              <QuickAction icon="hail" title="Add Trainer" subtitle="Onboard faculty members" onClick={() => navigate('/admin/trainers')} />
              <QuickAction icon="add_box" title="Create Course" subtitle="Launch new curriculum" onClick={() => navigate('/admin/courses')} />
              <QuickAction icon="calendar_add_on" title="Create Batch" subtitle="Schedule academic groups" onClick={() => navigate('/admin/batches')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

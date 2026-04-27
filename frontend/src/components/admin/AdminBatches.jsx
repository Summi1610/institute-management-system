import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { buildBatchScheduleFromCourseAndStartDate, formatBatchSchedule, toBackendDateTime } from './AdminShared';

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const initialBatchForm = {
    name: '',
    courseId: '',
    trainerId: '',
    startTime: '',
    endTime: ''
  };
  const [newBatch, setNewBatch] = useState(initialBatchForm);
  const [enroll, setEnroll] = useState({ batchId: '', studentId: '' });

  const selectedCourse = (Array.isArray(courses) ? courses : []).find(c => String(c.id) === newBatch.courseId);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [b, c, t, s] = await Promise.all([
        api.get('/admin/batches'),
        api.get('/admin/courses'),
        api.get('/admin/trainers'),
        api.get('/admin/students')
      ]);
      setBatches(b.data);
      setCourses(c.data);
      setTrainers(t.data);
      setStudents(s.data.filter(st => st.isApproved || !st.trialExpired));

      if (selectedBatch) {
        const updated = b.data.find(batch => batch.id === selectedBatch.id);
        if (updated) setSelectedBatch(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      ...newBatch,
      courseId: Number(newBatch.courseId),
      trainerId: Number(newBatch.trainerId),
      startTime: toBackendDateTime(newBatch.startTime),
      endTime: toBackendDateTime(newBatch.endTime)
    };

    try {
      await api.post('/admin/batches', payload);
      setNewBatch(initialBatchForm);
      setActiveForm(null);
      fetchData();
      alert('Batch Scheduled');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule batch');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/batches/${enroll.batchId}/students/${enroll.studentId}`);
      setEnroll({ ...enroll, studentId: '' });
      setActiveForm(null);
      fetchData();
      alert('Student Enrolled');
    } catch (err) {
      alert('Failed to enroll student');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">Batch Management</h2>
          <p className="text-slate-500 text-sm mt-1">Schedule academic batches, assign trainers, and manage student enrollment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)] relative overflow-hidden group">
          <div className="relative z-10">
            <p className="font-body uppercase tracking-widest text-[11px] text-slate-500 mb-1">Total Batches</p>
            <h3 className="text-3xl font-bold text-slate-900">{Array.isArray(batches) ? batches.length : 0}</h3>
            <div className="mt-4 flex items-center gap-1 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-semibold">+3 this month</span>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-slate-50 opacity-50 group-hover:scale-110 transition-transform">layers</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <p className="font-body uppercase tracking-widest text-[11px] text-slate-500 mb-1">Active Students</p>
          <h3 className="text-3xl font-bold text-slate-900">{Array.isArray(students) ? students.length : 0}</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-xs font-semibold">+12% vs last term</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <p className="font-body uppercase tracking-widest text-[11px] text-slate-500 mb-1">Ongoing Sessions</p>
          <h3 className="text-3xl font-bold text-slate-900">12</h3>
          <div className="mt-4 flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-sm">radio_button_checked</span>
            <span className="text-xs font-semibold">Currently Live</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => setActiveForm(activeForm === 'create' ? null : 'create')} className="flex-1 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all">
            <span className="material-symbols-outlined">{activeForm === 'create' ? 'close' : 'add_circle'}</span>
            {activeForm === 'create' ? 'Cancel' : 'Schedule Batch'}
          </button>
          <button onClick={() => setActiveForm(activeForm === 'enroll' ? null : 'enroll')} className="flex-1 bg-white text-primary border border-primary/10 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined">{activeForm === 'enroll' ? 'close' : 'person_add'}</span>
            {activeForm === 'enroll' ? 'Cancel' : 'Add Students'}
          </button>
        </div>
      </div>

      {activeForm === 'create' && (
        <div className="bg-primary p-8 rounded-2xl text-white mb-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6">Schedule New Batch</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Batch Name</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Select Course</label>
              <select className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" value={newBatch.courseId} onChange={e => {
                const courseId = e.target.value;
                const nextSelectedCourse = (Array.isArray(courses) ? courses : []).find(c => String(c.id) === courseId);
                const nextStartDate = newBatch.startTime || '';
                const schedule = buildBatchScheduleFromCourseAndStartDate(nextSelectedCourse, nextStartDate);
                setNewBatch({
                  ...newBatch,
                  courseId,
                  startTime: schedule.startTime,
                  endTime: schedule.endTime
                });
              }} required>
                <option value="" className="text-slate-900">Choose Course</option>
                {(Array.isArray(courses) ? courses : []).map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Assign Trainer</label>
              <select className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" value={newBatch.trainerId} onChange={e => setNewBatch({ ...newBatch, trainerId: e.target.value })} required>
                <option value="" className="text-slate-900">Choose Trainer</option>
                {(Array.isArray(trainers) ? trainers : []).map(t => <option key={t.id} value={t.id} className="text-slate-900">{t.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Start Date</label>
              <input type="date" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none [color-scheme:dark]" value={newBatch.startTime} onChange={e => {
                const startTime = e.target.value;
                const schedule = buildBatchScheduleFromCourseAndStartDate(selectedCourse, startTime);
                setNewBatch({
                  ...newBatch,
                  startTime,
                  endTime: schedule.endTime
                });
              }} required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Auto End Date</label>
              <input type="date" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white disabled:text-white/60 disabled:bg-white/5 disabled:cursor-not-allowed focus:bg-white/20 focus:outline-none [color-scheme:dark]" value={newBatch.endTime} disabled required />
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 flex items-center">
              <p className="text-sm text-white/85">
                Duration: {selectedCourse?.duration || 'Select a course'}
              </p>
            </div>
            <div className="md:col-span-3 text-right">
              <button type="submit" className="bg-white text-primary px-8 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Schedule Now</button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'enroll' && (
        <div className="bg-surface-container-low p-8 rounded-2xl mb-8 border-2 border-primary/20">
          <h3 className="text-xl font-bold mb-6 text-slate-900">Enroll Student in Batch</h3>
          <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Target Batch</label>
              <select className="w-full bg-white border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20" value={enroll.batchId} onChange={e => setEnroll({ ...enroll, batchId: e.target.value })} required>
                <option value="">Select Batch</option>
                {(Array.isArray(batches) ? batches : []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Student</label>
              <select className="w-full bg-white border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20" value={enroll.studentId} onChange={e => setEnroll({ ...enroll, studentId: e.target.value })} required>
                <option value="">Select Student</option>
                {(Array.isArray(students) ? students : []).map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 text-right">
              <button type="submit" className="bg-primary text-white px-8 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Complete Enrollment</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={selectedBatch ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">Active Batches</h4>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 font-body uppercase tracking-wider text-[11px] text-slate-500 font-semibold">Batch Details</th>
                  <th className="px-6 py-4 font-body uppercase tracking-wider text-[11px] text-slate-500 font-semibold">Trainer</th>
                  <th className="px-6 py-4 font-body uppercase tracking-wider text-[11px] text-slate-500 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(batches) ? batches : []).map(b => (
                  <tr key={b.id} onClick={() => setSelectedBatch(b)} className={`hover:bg-surface-container-low transition-colors group cursor-pointer ${selectedBatch?.id === b.id ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{b.name}</span>
                        <span className="text-xs text-slate-500">{b.course?.name}</span>
                        <span className="text-[11px] text-slate-400 mt-1">{formatBatchSchedule(b.startTime, b.endTime)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                          {b.trainer?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{b.trainer?.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-primary font-bold text-xs hover:underline">View Students ({b.students?.length || 0})</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBatch && (
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900">Students in {selectedBatch.name}</h4>
              <button onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
              <div className="mb-4 rounded-xl bg-surface-container-low p-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Schedule</p>
                <p className="text-sm font-semibold text-slate-700">{formatBatchSchedule(selectedBatch.startTime, selectedBatch.endTime)}</p>
              </div>
              <div className="space-y-4">
                {selectedBatch.students && selectedBatch.students.length > 0 ? (
                  selectedBatch.students.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold shadow-sm">
                          {s.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{s.username}</p>
                          <p className="text-[10px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full uppercase">Enrolled</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 italic">No students enrolled in this batch yet.</div>
                )}
              </div>
              <button onClick={() => { setActiveForm('enroll'); setEnroll(prev => ({ ...prev, batchId: selectedBatch.id })); }} className="w-full mt-6 py-3 border-2 border-dashed border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/5 transition-all">
                + Enroll More Students
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBatches;

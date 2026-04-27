import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CourseCard, StatCard } from './AdminShared';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', duration: '', description: '' });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const [cRes, bRes] = await Promise.all([
        api.get('/admin/courses'),
        api.get('/admin/batches')
      ]);
      setCourses(cRes.data);
      setBatches(bRes.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', {
        name: newCourse.name,
        duration: newCourse.duration,
        description: newCourse.description || `Comprehensive curriculum for ${newCourse.name}`
      });
      setNewCourse({ name: '', duration: '', description: '' });
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      alert('Failed to create course');
    }
  };

  const getBatchCount = (courseId) => {
    return (Array.isArray(batches) ? batches : []).filter(b => b.course?.id === courseId).length;
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-slate-900">Course Management</h2>
          <p className="text-slate-500 font-body mt-2">Curate and manage your institute's academic curriculum.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-semibold shadow-[0px_12px_32px_rgba(53,37,205,0.15)] transition-transform active:scale-95">
          <span className="material-symbols-outlined text-xl">{showForm ? 'close' : 'add'}</span>
          <span>{showForm ? 'Close Form' : 'Create New Course'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-primary p-8 rounded-2xl text-white mb-8 shadow-xl">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Course Name</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} placeholder="e.g. Full Stack Development" required />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Duration (Weeks)</label>
              <input type="text" className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} placeholder="e.g. 12 Weeks" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold mb-2 opacity-80">Description</label>
              <textarea className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-2 text-white focus:bg-white/20 focus:outline-none" rows="2" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Optional course summary..."></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-white text-primary px-8 py-2 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Launch Course</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Courses" value={courses.length} subtitle="Institute Wide" icon="menu_book" trend="+12%" trendIcon="trending_up" />
        <StatCard title="Active Batches" value={batches.length} subtitle="Ongoing sessions" icon="layers" />
        <StatCard title="Avg. Duration" value="4.5 Mo." subtitle="Per course" icon="schedule" />
        <StatCard title="Enrolled Students" value="2,840" subtitle="Total across batches" icon="group" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(Array.isArray(courses) ? courses : []).map(course => (
          <CourseCard key={course.id} course={course} batchCount={getBatchCount(course.id)} />
        ))}
        {courses.length === 0 && !showForm && (
          <div onClick={() => setShowForm(true)} className="col-span-full border-2 border-dashed border-outline-variant/40 rounded-[2rem] flex flex-col items-center justify-center p-12 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
            </div>
            <h4 className="font-headline font-bold text-lg text-slate-900">Add New Curriculum</h4>
            <p className="text-slate-500 text-sm font-body mt-2 max-w-md mx-auto">Design a new course path for the upcoming academic session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;

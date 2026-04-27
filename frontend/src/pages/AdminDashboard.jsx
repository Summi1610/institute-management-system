import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminOverview from '../components/admin/AdminOverview';
import AdminCourses from '../components/admin/AdminCourses';
import AdminStudents from '../components/admin/AdminStudents';
import AdminTrainers from '../components/admin/AdminTrainers';
import AdminBatches from '../components/admin/AdminBatches';

const AdminDashboard = () => {
  return (
    <Layout roleTitle="Super Administrator">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/students" element={<AdminStudents />} />
        <Route path="/trainers" element={<AdminTrainers />} />
        <Route path="/courses" element={<AdminCourses />} />
        <Route path="/batches" element={<AdminBatches />} />
      </Routes>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-primary hover:bg-primary-container text-white w-14 h-14 rounded-full shadow-[0px_12px_32px_rgba(53,37,205,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
          <span className="material-symbols-outlined text-3xl">add</span>
          <span className="absolute right-16 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Create Entry</span>
        </button>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

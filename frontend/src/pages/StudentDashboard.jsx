import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StudentHome from '../components/student/StudentHome';
import StudentTasks from '../components/student/StudentTasks';
import StudentResources from '../components/student/StudentResources';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, materialRes] = await Promise.all([
        api.get('/student/my-tasks'),
        api.get('/student/my-materials')
      ]);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      setMaterials(Array.isArray(materialRes.data) ? materialRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.post(`/student/tasks/${taskId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <Layout roleTitle="Candidate Workspace">
        <div className="text-center py-16 text-slate-500">Loading your CPV...</div>
      </Layout>
    );
  }

  return (
    <Layout roleTitle="Candidate Workspace">
      <Routes>
        <Route path="/" element={<StudentHome user={user} tasks={tasks} materials={materials} />} />
        <Route path="/tasks" element={<StudentTasks tasks={tasks} onUpdateStatus={updateStatus} />} />
        <Route path="/resources" element={<StudentResources materials={materials} />} />
      </Routes>
    </Layout>
  );
};

export default StudentDashboard;

import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TrainerHome from '../components/trainer/TrainerHome';
import TrainerAssignments from '../components/trainer/TrainerAssignments';
import TrainerResources from '../components/trainer/TrainerResources';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get('/trainer/my-batches');
        setBatches(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBatches();
  }, []);

  return (
    <Layout roleTitle="Lead Instructor">
      <Routes>
        <Route path="/" element={<TrainerHome user={user} batches={batches} />} />
        <Route path="/assignments" element={<TrainerAssignments batches={batches} />} />
        <Route path="/resources" element={<TrainerResources batches={batches} />} />
      </Routes>
    </Layout>
  );
};

export default TrainerDashboard;

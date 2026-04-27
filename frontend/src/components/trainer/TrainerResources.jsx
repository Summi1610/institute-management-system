import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BatchSelector } from './TrainerShared';

const TrainerResources = ({ batches }) => {
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [newMaterial, setNewMaterial] = useState({ title: '', url: '', file: null, type: 'DOCUMENT' });
  const [materialError, setMaterialError] = useState('');

  useEffect(() => {
    if (!selectedBatchId && batches.length > 0) {
      setSelectedBatchId(String(batches[0].id));
    }
  }, [batches, selectedBatchId]);

  const handleShareMaterial = async (e) => {
    e.preventDefault();
    setMaterialError('');

    if (newMaterial.type === 'VIDEO' && !newMaterial.url) {
      setMaterialError('Video link is required.');
      return;
    }

    if (newMaterial.type === 'DOCUMENT' && !newMaterial.file) {
      setMaterialError('PDF file is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newMaterial.title);
      formData.append('type', newMaterial.type);
      if (newMaterial.type === 'VIDEO') {
        formData.append('url', newMaterial.url);
      }
      if (newMaterial.file) {
        formData.append('file', newMaterial.file);
      }

      await api.post(`/trainer/batches/${selectedBatchId}/materials`, formData);
      alert('Material Shared');
      setNewMaterial({ title: '', url: '', file: null, type: 'DOCUMENT' });
    } catch (err) {
      setMaterialError(err.response?.data?.message || 'Material sharing failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold text-slate-900">Resources</h2>
        <p className="text-slate-500 mt-1">Share documents and recordings with your selected batch.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
        <form onSubmit={handleShareMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BatchSelector batches={batches} selectedBatchId={selectedBatchId} onChange={setSelectedBatchId} label="Target Batch" />
          <div>
            <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Resource Type</label>
            <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={newMaterial.type} onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value, url: '', file: null })}>
              <option value="DOCUMENT">Document (PDF/Doc)</option>
              <option value="VIDEO">Video Recording</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Resource Title</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={newMaterial.title} onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })} required />
          </div>
          {newMaterial.type === 'VIDEO' ? (
            <div>
              <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Video Link</label>
              <input type="url" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={newMaterial.url} onChange={e => setNewMaterial({ ...newMaterial, url: e.target.value })} required />
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Upload PDF</label>
              <input type="file" accept="application/pdf" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null, url: '' })} required />
            </div>
          )}
          {materialError && (
            <div className="md:col-span-2 rounded-2xl bg-error/10 text-error px-4 py-3 text-sm font-semibold">
              {materialError}
            </div>
          )}
          <div className="md:col-span-2">
            <button type="submit" disabled={!selectedBatchId} className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Share with Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerResources;

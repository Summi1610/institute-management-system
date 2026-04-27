import React from 'react';

export const formatBatchSchedule = (startTime, endTime) => {
  const formatValue = (value) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString([], { dateStyle: 'medium' });
  };

  const formattedStart = formatValue(startTime);
  const formattedEnd = formatValue(endTime);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart || formattedEnd || 'Schedule pending';
};

export const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
    <p className="font-body uppercase tracking-widest text-[11px] text-slate-500 mb-2">{title}</p>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-3xl font-headline font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  </div>
);

export const BatchSelector = ({ batches, selectedBatchId, onChange, label }) => (
  <div>
    <label className="block text-xs uppercase font-bold mb-2 text-slate-500">{label}</label>
    <select
      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
      value={selectedBatchId}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Select Batch</option>
      {batches.map(batch => (
        <option key={batch.id} value={batch.id}>
          {batch.name}
        </option>
      ))}
    </select>
  </div>
);

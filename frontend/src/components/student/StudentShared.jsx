import React from 'react';

export const formatDate = (value) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

export const getStatusClasses = (status) => {
  if (status === 'COMPLETED') return 'bg-[#DCFCE7] text-[#166534]';
  if (status === 'WORKING') return 'bg-[#FEF3C7] text-[#92400E]';
  return 'bg-slate-100 text-slate-600';
};

export const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
    <p className="font-body uppercase tracking-widest text-[11px] text-slate-500 mb-2">{title}</p>
    <div className="flex items-center justify-between gap-4">
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

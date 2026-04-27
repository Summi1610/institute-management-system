import React from 'react';
import { Link } from 'react-router-dom';
import { formatBatchSchedule, StatCard } from './TrainerShared';

const TrainerHome = ({ user, batches }) => {
  const totalStudents = batches.reduce((sum, batch) => sum + (batch.students?.length || 0), 0);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-8 text-white shadow-[0px_20px_48px_rgba(53,37,205,0.16)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center text-2xl font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <div>
              <p className="uppercase tracking-[0.24em] text-[11px] text-white/70 mb-2">Trainer Dashboard</p>
              <h2 className="text-3xl font-headline font-bold">{user?.username || 'Trainer'}</h2>
              <p className="text-white/80 mt-2">{user?.email || 'No email available'}</p>
              <p className="text-sm text-white/70 mt-1">Manage your batches, assignments, and study materials from one workspace.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/trainer/assignments" className="px-5 py-3 rounded-xl bg-white text-primary font-semibold shadow-lg">
              Create Assignment
            </Link>
            <Link to="/trainer/resources" className="px-5 py-3 rounded-xl border border-white/20 bg-white/10 font-semibold text-white">
              Share Resource
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Assigned Batches" value={batches.length} subtitle="Active teaching groups" icon="layers" />
        <StatCard title="Total Students" value={totalStudents} subtitle="Across all assigned batches" icon="groups" />
        <StatCard title="Course Coverage" value={new Set(batches.map(batch => batch.course?.id).filter(Boolean)).size} subtitle="Unique courses in progress" icon="menu_book" />
      </section>

      <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-headline font-bold text-slate-900">My Batches</h3>
            <p className="text-slate-500 mt-1">Your currently assigned groups and their schedules.</p>
          </div>
        </div>

        {batches.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500">
            No batches assigned yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {batches.map(batch => (
              <div key={batch.id} className="border border-slate-100 rounded-3xl p-6 bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{batch.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{batch.course?.name || 'Unassigned course'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {batch.students?.length || 0} Students
                  </span>
                </div>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                    {formatBatchSchedule(batch.startTime, batch.endTime)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-primary">school</span>
                    {batch.course?.duration || 'Duration unavailable'}
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link to="/trainer/assignments" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
                    Assign Work
                  </Link>
                  <Link to="/trainer/resources" className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold">
                    Share Material
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TrainerHome;

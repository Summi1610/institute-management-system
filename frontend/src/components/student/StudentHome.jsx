import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getStatusClasses, StatCard } from './StudentShared';

const StudentHome = ({ user, tasks, materials }) => {
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const workingTasks = tasks.filter((task) => task.status === 'WORKING').length;
  const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;
  const uniqueBatchCount = new Set(tasks.map((task) => task.task?.batch?.id).filter(Boolean)).size;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const resourcesByBatch = new Set(materials.map((material) => material.batch?.id).filter(Boolean)).size;
  const upcomingTasks = [...tasks]
    .filter((task) => task.task?.deadline)
    .sort((a, b) => new Date(a.task.deadline) - new Date(b.task.deadline))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-8 text-white shadow-[0px_20px_48px_rgba(53,37,205,0.16)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center text-2xl font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <p className="uppercase tracking-[0.24em] text-[11px] text-white/70 mb-2">Student Dashboard</p>
              <h2 className="text-3xl font-headline font-bold">{user?.username || 'Student'}</h2>
              <p className="text-white/80 mt-2">{user?.email || 'No email available'}</p>
              <p className="text-sm text-white/70 mt-1">View your profile, check progress, and move into tasks or resource links from the workspace menu.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[220px]">
            <div className="rounded-2xl bg-white/10 px-4 py-4">
              <p className="text-[11px] uppercase tracking-widest text-white/60">Progress</p>
              <p className="text-2xl font-bold mt-2">{progress}%</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-4">
              <p className="text-[11px] uppercase tracking-widest text-white/60">Batches</p>
              <p className="text-2xl font-bold mt-2">{uniqueBatchCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Assigned Tasks" value={tasks.length} subtitle={`${pendingTasks} pending tasks`} icon="assignment" />
        <StatCard title="Task Progress" value={workingTasks} subtitle="Currently in progress" icon="pending_actions" />
        <StatCard title="Completed Work" value={completedTasks} subtitle="Finished assignments" icon="task_alt" />
        <StatCard title="Resources" value={materials.length} subtitle={`Shared across ${resourcesByBatch} batches`} icon="folder_open" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-headline font-bold text-slate-900">Profile Snapshot</h3>
              <p className="text-slate-500 mt-1">Basic account and learning workspace details.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-surface-container-low p-5">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Username</p>
              <p className="text-lg font-bold text-slate-900 mt-2">{user?.username || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-5">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Email</p>
              <p className="text-lg font-bold text-slate-900 mt-2 break-words">{user?.email || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-5">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Role</p>
              <p className="text-lg font-bold text-slate-900 mt-2">Student</p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-5">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">Account Status</p>
              <p className="text-lg font-bold text-slate-900 mt-2">{user?.isApproved ? 'Approved' : 'In Trial'}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Link to="/student/tasks" className="px-5 py-3 rounded-xl bg-primary text-white font-semibold">
              Open Tasks
            </Link>
            <Link to="/student/resources" className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold">
              Open Resources
            </Link>
          </div>
        </div>

        <div className="xl:col-span-5 bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <h3 className="text-2xl font-headline font-bold text-slate-900 mb-5">Upcoming Task Progress</h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No deadlines scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="rounded-2xl bg-surface-container-low p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-widest text-primary font-bold">{task.task?.batch?.name || 'Batch'}</p>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusClasses(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-3">{task.task?.title}</p>
                  <p className="text-xs text-slate-500 mt-2">Due {formatDate(task.task?.deadline)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHome;

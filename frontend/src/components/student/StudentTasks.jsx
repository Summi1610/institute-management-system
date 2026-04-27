import React from 'react';
import { formatDate, getStatusClasses } from './StudentShared';
import { openProtectedFile } from '../../utils/fileDownload';

const StudentTasks = ({ tasks, onUpdateStatus }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-headline font-bold text-slate-900">My Tasks</h2>
      <p className="text-slate-500 mt-1">Review your assignments and update their status as you work.</p>
    </div>

    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
      {tasks.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          No tasks assigned yet.
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border border-slate-100 rounded-2xl p-5 bg-white">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-widest text-primary font-bold">{task.task?.batch?.name || 'Batch'}</p>
                  <h4 className="text-lg font-bold text-slate-900">{task.task?.title}</h4>
                  <p className="text-sm text-slate-500 max-w-3xl">{task.task?.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-2">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">event</span>
                      Due {formatDate(task.task?.deadline)}
                    </span>
                    {task.task?.attachmentName && (
                      <button
                        type="button"
                        onClick={() => openProtectedFile(`/student/tasks/${task.id}/file`)}
                        className="flex items-center gap-2 font-semibold text-primary hover:underline"
                      >
                        <span className="material-symbols-outlined text-base">description</span>
                        Open Task PDF
                      </button>
                    )}
                    {task.submissionDate && (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">upload</span>
                        Submitted {formatDate(task.submissionDate)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-3 min-w-[220px]">
                  <span className={`px-3 py-2 rounded-full text-xs font-bold ${getStatusClasses(task.status)}`}>
                    {task.status}
                  </span>
                  <select className="w-full lg:w-auto bg-surface-container-low border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" value={task.status} onChange={(e) => onUpdateStatus(task.id, e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="WORKING">Working</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default StudentTasks;

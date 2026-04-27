import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BatchSelector } from './TrainerShared';
import { openProtectedFile } from '../../utils/fileDownload';

const TrainerAssignments = ({ batches }) => {
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [batchTasks, setBatchTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [studentProgress, setStudentProgress] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', file: null });
  const [taskError, setTaskError] = useState('');
  const selectedTask = batchTasks.find(task => String(task.id) === String(selectedTaskId));

  useEffect(() => {
    if (!selectedBatchId && batches.length > 0) {
      setSelectedBatchId(String(batches[0].id));
    }
  }, [batches, selectedBatchId]);

  useEffect(() => {
    const fetchBatchTasks = async () => {
      if (!selectedBatchId) {
        setBatchTasks([]);
        setSelectedTaskId('');
        setStudentProgress([]);
        return;
      }

      try {
        const res = await api.get(`/trainer/batches/${selectedBatchId}/tasks`);
        const tasks = Array.isArray(res.data) ? res.data : [];
        setBatchTasks(tasks);
        setSelectedTaskId(tasks[0]?.id ? String(tasks[0].id) : '');
      } catch (err) {
        console.error(err);
        setBatchTasks([]);
        setSelectedTaskId('');
      }
    };

    fetchBatchTasks();
  }, [selectedBatchId]);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!selectedTaskId) {
        setStudentProgress([]);
        return;
      }

      try {
        const res = await api.get(`/trainer/tasks/${selectedTaskId}/progress`);
        setStudentProgress(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setStudentProgress([]);
      }
    };

    fetchStudentProgress();
  }, [selectedTaskId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');

    try {
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('deadline', newTask.deadline);
      if (newTask.file) {
        formData.append('file', newTask.file);
      }

      await api.post(`/trainer/batches/${selectedBatchId}/tasks`, formData);
      alert('Task Created');
      setNewTask({ title: '', description: '', deadline: '', file: null });

      const tasksRes = await api.get(`/trainer/batches/${selectedBatchId}/tasks`);
      const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
      setBatchTasks(tasks);
      setSelectedTaskId(tasks[0]?.id ? String(tasks[0].id) : '');
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Task creation failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold text-slate-900">Assignments</h2>
        <p className="text-slate-500 mt-1">Create and assign academic work for a selected batch.</p>
      </div>

      {batches.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-[0px_12px_32px_rgba(53,37,205,0.04)] text-center text-slate-500">
          No batches are assigned to this trainer yet.
        </div>
      ) : (
        <>
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
            <BatchSelector
              batches={batches}
              selectedBatchId={selectedBatchId}
              onChange={setSelectedBatchId}
              label="Select Batch"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-6 bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[11px] uppercase tracking-widest text-slate-500">Target Batch</p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {batches.find(batch => String(batch.id) === String(selectedBatchId))?.name || 'Select a batch above'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Deadline</label>
                  <input type="datetime-local" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Task Title</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Instructions</label>
                  <textarea className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" rows="5" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Task PDF</label>
                  <input type="file" accept="application/pdf" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" onChange={e => setNewTask({ ...newTask, file: e.target.files?.[0] || null })} />
                </div>
                {taskError && (
                  <div className="md:col-span-2 rounded-2xl bg-error/10 text-error px-4 py-3 text-sm font-semibold">
                    {taskError}
                  </div>
                )}
                <div className="md:col-span-2">
                  <button type="submit" disabled={!selectedBatchId} className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    Assign to Batch
                  </button>
                </div>
              </form>
            </div>

            <div className="xl:col-span-6 bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Student Progress</h3>
                  <p className="text-slate-500 mt-1">Select a task from the chosen batch to view each student's current status.</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold mb-2 text-slate-500">Task</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} disabled={!selectedBatchId || batchTasks.length === 0}>
                      <option value="">Select Task</option>
                      {batchTasks.map(task => (
                        <option key={task.id} value={task.id}>{task.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedTask && (
                    <div className="rounded-2xl bg-surface-container-low p-5">
                      <p className="text-[11px] uppercase tracking-widest text-slate-500">Selected Task</p>
                      <h4 className="text-lg font-bold text-slate-900 mt-2">{selectedTask.title}</h4>
                      <p className="text-sm text-slate-500 mt-2">{selectedTask.description}</p>
                      <p className="text-sm text-slate-600 mt-3">
                        <span className="font-semibold text-slate-900">Deadline:</span> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleString() : 'Not set'}
                      </p>
                      {selectedTask.attachmentName && (
                        <button
                          type="button"
                          onClick={() => openProtectedFile(`/trainer/tasks/${selectedTask.id}/attachment`)}
                          className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:underline"
                        >
                          <span className="material-symbols-outlined text-base">description</span>
                          Open Task PDF
                        </button>
                      )}
                    </div>
                  )}

                  {!selectedBatchId ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-500">Choose a batch to load assignments.</div>
                  ) : batchTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-500">No tasks have been created for this batch yet.</div>
                  ) : studentProgress.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-500">No student progress available for the selected task yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {studentProgress.map(progress => (
                        <div key={progress.id} className="border border-slate-100 rounded-2xl p-4 bg-white flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{progress.student?.username || 'Student'}</p>
                            <p className="text-xs text-slate-500 mt-1">{progress.student?.email || 'No email available'}</p>
                            {progress.submissionDate && (
                              <p className="text-xs text-slate-400 mt-2">Updated {new Date(progress.submissionDate).toLocaleString()}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-2 rounded-full text-xs font-bold ${progress.status === 'COMPLETED' ? 'bg-[#DCFCE7] text-[#166534]' : progress.status === 'WORKING' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-slate-100 text-slate-600'}`}>
                              {progress.status}
                            </span>
                            {progress.submissionUrl && (
                              <a href={progress.submissionUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">
                                Open Submission
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerAssignments;

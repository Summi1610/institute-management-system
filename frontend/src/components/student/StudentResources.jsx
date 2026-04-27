import React from 'react';
import { openProtectedFile } from '../../utils/fileDownload';

const StudentResources = ({ materials }) => {
  const videoMaterials = materials.filter((material) => material.type === 'VIDEO');
  const documentMaterials = materials.filter((material) => material.type === 'DOCUMENT');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold text-slate-900">Resources</h2>
        <p className="text-slate-500 mt-1">Open shared recordings and study materials for your batches. Teams meeting recordings can be opened directly from these links.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <h3 className="text-xl font-headline font-bold text-slate-900 mb-5">Recording Links</h3>
          {videoMaterials.length === 0 ? (
            <p className="text-sm text-slate-500">No recording links shared yet.</p>
          ) : (
            <div className="space-y-4">
              {videoMaterials.map((material) => (
                <div key={material.id} className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[11px] uppercase tracking-widest text-slate-500">{material.batch?.name || 'Batch'}</p>
                  <p className="text-sm font-bold text-slate-900 mt-2">{material.title}</p>
                  <a href={material.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:underline">
                    <span className="material-symbols-outlined text-base">videocam</span>
                    Open Recording
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_12px_32px_rgba(53,37,205,0.04)]">
          <h3 className="text-xl font-headline font-bold text-slate-900 mb-5">Study Materials</h3>
          {documentMaterials.length === 0 ? (
            <p className="text-sm text-slate-500">No materials yet.</p>
          ) : (
            <div className="space-y-4">
              {documentMaterials.map((material) => (
                <div key={material.id} className="rounded-2xl bg-surface-container-low p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-widest text-slate-500">{material.batch?.name || 'Batch'}</p>
                    <p className="text-sm font-bold text-slate-900 mt-2 break-words">{material.title}</p>
                    <button
                      type="button"
                      onClick={() => openProtectedFile(`/student/materials/${material.id}/file`)}
                      className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      Open Material
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentResources;

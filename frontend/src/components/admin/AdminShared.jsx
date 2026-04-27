import React from 'react';

export const toDateValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

export const toBackendDateTime = (value) => {
  return value ? `${value}T00:00:00` : '';
};

export const parseCourseDurationWeeks = (duration) => {
  const match = String(duration || '').match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

export const buildBatchScheduleFromCourseAndStartDate = (course, startDateValue) => {
  const weeks = parseCourseDurationWeeks(course?.duration);
  if (!weeks || !startDateValue) {
    return { startTime: '', endTime: '' };
  }

  const start = new Date(`${startDateValue}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return { startTime: '', endTime: '' };
  }

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + (weeks * 7));

  return {
    startTime: startDateValue,
    endTime: toDateValue(end)
  };
};

export const buildBatchScheduleFromCourse = (course) => {
  return buildBatchScheduleFromCourseAndStartDate(course, toDateValue(new Date()));
};

export const formatBatchSchedule = (startTime, endTime) => {
  if (!startTime && !endTime) {
    return 'Schedule pending';
  }

  const formatValue = (value) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString([], {
      dateStyle: 'medium'
    });
  };

  const formattedStart = formatValue(startTime);
  const formattedEnd = formatValue(endTime);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart || formattedEnd || 'Schedule pending';
};

export const StatCard = ({ title, value, icon, trend, trendIcon, subtitle }) => (
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(53,37,205,0.04)] relative overflow-hidden group">
    {trend && (
      <div className="absolute top-4 right-4 bg-tertiary/10 text-tertiary px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
        {trend}
      </div>
    )}
    <p className="font-body uppercase tracking-wider text-[11px] text-slate-500 mb-2">{title}</p>
    <h3 className="text-3xl font-headline font-bold text-slate-900">{value}</h3>
    <div className="mt-4 flex items-center text-xs text-slate-400 gap-1">
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      {subtitle || 'vs. last month'}
    </div>
  </div>
);

export const QuickAction = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group backdrop-blur-md w-full text-left">
    <div className="w-10 h-10 rounded-lg bg-white text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="font-bold font-headline">{title}</p>
      <p className="text-[11px] text-white/70">{subtitle}</p>
    </div>
  </button>
);

export const CourseCard = ({ course, batchCount }) => (
  <div className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col shadow-[0px_12px_32px_rgba(53,37,205,0.03)] hover:shadow-[0px_20px_48px_rgba(53,37,205,0.08)] transition-all duration-300">
    <div className="relative h-48 bg-slate-200">
      <div className="absolute inset-0 bg-primary/5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute bottom-4 left-6">
        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
          Academic
        </span>
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xl font-bold font-headline leading-tight">{course.name}</h4>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>
      </div>
      <p className="text-slate-500 text-sm font-body mb-6 line-clamp-2">{course.description || `Master the concepts of ${course.name} through our comprehensive curriculum.`}</p>
      <div className="flex items-center gap-6 mb-8 text-slate-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">schedule</span>
          <span className="text-xs font-semibold">{course.duration || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          <span className="text-xs font-semibold">{batchCount} Batches</span>
        </div>
      </div>
    </div>
  </div>
);

export const PerformanceCard = ({ title, value, trend, icon, trendColor }) => (
  <div className="p-6 rounded-2xl bg-surface-container-low">
    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{title}</p>
    <h4 className="text-3xl font-extrabold text-slate-900">{value}</h4>
    <div className={`mt-3 flex items-center text-xs font-bold ${trendColor}`}>
      <span className="material-symbols-outlined text-sm mr-1">{icon}</span>
      {trend}
    </div>
  </div>
);

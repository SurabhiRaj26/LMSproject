const ProgressBar = ({ percentage = 0, label }) => {
  const pct = Math.min(100, Math.max(0, Math.round(percentage)));
  const color = pct === 100 ? 'from-emerald-500 to-emerald-400' : 'from-primary-600 to-accent-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">{label || 'Progress'}</span>
        <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-400' : 'text-primary-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-xs text-emerald-400 mt-1.5 font-medium">🎉 Course Completed!</p>
      )}
    </div>
  );
};

export default ProgressBar;

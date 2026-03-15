import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

const SidebarLessons = ({ lessons, currentLesson, completedLessons, onSelectLesson }) => {
  const isCompleted = (id) => completedLessons?.some((l) => l === id || l?._id === id);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-white text-sm">Course Content</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {completedLessons?.length || 0}/{lessons.length} lessons completed
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {lessons.map((lesson, index) => {
          const active = currentLesson?._id === lesson._id;
          const done = isCompleted(lesson._id);

          return (
            <button
              key={lesson._id}
              id={`lesson-btn-${lesson._id}`}
              onClick={() => onSelectLesson(lesson)}
              className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-slate-800/60 transition-all duration-200
                ${active ? 'bg-primary-600/15 border-l-2 border-l-primary-500' : 'hover:bg-slate-800/50'}
              `}
            >
              <div className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : active ? (
                  <PlayCircle className="w-5 h-5 text-primary-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium mb-0.5 ${active ? 'text-primary-300' : done ? 'text-emerald-300' : 'text-slate-400'}`}>
                  Lesson {index + 1}
                </p>
                <p className={`text-sm font-medium leading-snug line-clamp-2 ${active ? 'text-white' : 'text-slate-300'}`}>
                  {lesson.title}
                </p>
                {lesson.duration && (
                  <p className="text-xs text-slate-600 mt-1">{lesson.duration}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarLessons;

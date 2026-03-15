import { Link } from 'react-router-dom';
import { Users, Clock, Star, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  const thumbnail = course.thumbnail || `https://img.youtube.com/vi/K5KVEU3aaeQ/maxresdefault.jpg`;

  const levelColor = {
    Beginner: 'text-emerald-400 bg-emerald-400/10',
    Intermediate: 'text-amber-400 bg-amber-400/10',
    Advanced: 'text-red-400 bg-red-400/10',
  }[course.level] || 'text-blue-400 bg-blue-400/10';

  return (
    <div className="card group overflow-hidden hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/10 flex flex-col">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video bg-slate-800">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://placehold.co/640x360/1e293b/94a3b8?text=Course`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor}`}>
          {course.level}
        </span>
        {course.category && (
          <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-dark-900/80 text-slate-300 border border-slate-700/50">
            {course.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white mb-1.5 line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-primary-400" />
            {course.totalLessons || 0} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            {(course.enrolledStudents?.length || 0)} students
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {course.rating?.toFixed(1) || '4.5'}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {course.instructorName?.[0] || 'I'}
          </div>
          <span className="text-xs text-slate-400 truncate">{course.instructorName || 'Instructor'}</span>
        </div>

        {/* CTA */}
        <Link
          to={`/courses/${course._id}`}
          id={`course-card-${course._id}`}
          className="btn-primary text-sm text-center block"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;

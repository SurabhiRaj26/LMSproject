import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseAPI, getLessonsAPI, enrollCourseAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Star, Clock, Play, CheckCircle, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: c }, { data: l }] = await Promise.all([getCourseAPI(id), getLessonsAPI(id)]);
        setCourse(c);
        setLessons(l);
        if (user) setIsEnrolled(c.enrolledStudents?.includes(user._id));
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true);
    try {
      await enrollCourseAPI(id);
      setIsEnrolled(true);
      toast.success('Enrolled successfully! 🎉');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Already enrolled') {
        setIsEnrolled(true);
      } else {
        toast.error(msg || 'Enrollment failed');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-b border-slate-800 py-14 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary-600/20 text-primary-300 rounded-full border border-primary-500/30">
                {course.category || 'Course'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
            <p className="text-slate-400 text-base leading-relaxed mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-5 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {course.rating?.toFixed(1) || '4.5'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                {course.enrolledStudents?.length || 0} students enrolled
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary-400" />
                {lessons.length} lessons
              </span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                {course.instructorName?.[0] || 'I'}
              </div>
              <div>
                <p className="text-xs text-slate-500">Instructor</p>
                <p className="text-sm font-semibold text-white">{course.instructorName}</p>
              </div>
            </div>

            {isEnrolled ? (
              <button
                id="start-learning-btn"
                onClick={() => navigate(`/learn/${id}`)}
                className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
              >
                <Play className="w-5 h-5" /> Continue Learning
              </button>
            ) : (
              <button
                id="enroll-btn"
                onClick={handleEnroll} disabled={enrolling}
                className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
              >
                {enrolling ? <><Loader2 className="w-5 h-5 animate-spin" /> Enrolling...</> : <><CheckCircle className="w-5 h-5" /> Enroll for Free</>}
              </button>
            )}
          </div>

          {/* Right: Thumbnail */}
          <div className="lg:w-96 shrink-0 w-full">
            <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl">
              <img
                src={course.thumbnail || `https://img.youtube.com/vi/${lessons[0]?.youtubeId || 'K5KVEU3aaeQ'}/maxresdefault.jpg`}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/640x360/1e293b/94a3b8?text=Course'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-white mb-6">Course Curriculum</h2>
        <div className="card divide-y divide-slate-800/60">
          {lessons.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No lessons available yet.</div>
          ) : (
            lessons.map((lesson, idx) => (
              <div key={lesson._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/20 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-200 text-sm">{lesson.title}</p>
                  {lesson.description && <p className="text-xs text-slate-500 mt-0.5">{lesson.description}</p>}
                </div>
                {isEnrolled ? (
                  <Play className="w-4 h-4 text-primary-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

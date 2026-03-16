import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonsAPI, getCourseAPI, updateProgressAPI, getCourseProgressAPI, getCoursesAPI } from '../api/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import SidebarLessons from '../components/SidebarLessons';
import ProgressBar from '../components/ProgressBar';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], percentage: 0, lastWatchedLesson: null });
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [{ data: c }, { data: l }, { data: p }, { data: all_c }] = await Promise.all([
          getCourseAPI(courseId),
          getLessonsAPI(courseId),
          getCourseProgressAPI(courseId),
          getCoursesAPI(),
        ]);
        setCourse(c);
        setLessons(l);
        setProgress(p);
        
        // Fix: all_c is directly the array of courses
        const allCourses = Array.isArray(all_c) ? all_c : (all_c.courses || []);
        const related = allCourses.filter(course => course._id !== courseId).slice(0, 6);
        setRelatedCourses(related);

        // Resume last watched or start at first
        const resume = l.find((le) => le._id === p?.lastWatchedLesson?._id) || l[0];
        setCurrentLesson(resume || null);
      } catch {
        toast.error('Failed to load course');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    setMarking(true);
    try {
      const { data } = await updateProgressAPI({ courseId, lessonId: currentLesson._id });
      setProgress(data);
      toast.success('Lesson marked as complete! ✅');
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setMarking(false);
    }
  };

  const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCompleted = progress.completedLessons?.some(
    (l) => l === currentLesson?._id || l?._id === currentLesson?._id
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-950 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="back-to-course-btn"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="btn-ghost text-sm py-1.5 px-3 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="hidden sm:block w-px h-5 bg-slate-700" />
          <h1 className="hidden sm:block text-sm font-semibold text-white truncate max-w-xs lg:max-w-md">
            {course?.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-40">
            <ProgressBar percentage={progress.percentage} label="" />
          </div>
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-400"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Video + Controls */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-6">
          {/* DEBUG INFO */}
          <div className="bg-red-900/30 border border-red-500/50 p-2 rounded-xl mb-3 text-xs text-red-200">
            DEBUG: LessonID: {currentLesson?._id} | YoutubeID: <span className="font-bold underline text-white">{currentLesson?.youtubeId || 'MISSING/EMPTY'}</span>
          </div>

          {/* Video Player */}
          <VideoPlayer videoId={currentLesson?.youtubeId} title={currentLesson?.title} />


          {/* Lesson Info */}
          <div className="mt-5">
            <h2 className="text-xl font-bold text-white mb-1">
              {currentLesson?.title || 'Select a lesson'}
            </h2>
            {currentLesson?.description && (
              <p className="text-slate-500 text-sm">{currentLesson.description}</p>
            )}
          </div>

          {/* Progress */}
          <div className="mt-5 card p-4">
            <ProgressBar percentage={progress.percentage} label="Course Progress" />
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <button
              id="prev-lesson-btn"
              disabled={!prevLesson}
              onClick={() => prevLesson && setCurrentLesson(prevLesson)}
              className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {!isCompleted ? (
              <button
                id="mark-complete-btn"
                onClick={handleMarkComplete}
                disabled={marking || !currentLesson}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {marking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Mark as Complete
              </button>
            ) : (
              <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Completed
              </span>
            )}

              <button
                id="next-lesson-btn"
                disabled={!nextLesson}
                onClick={() => nextLesson && setCurrentLesson(nextLesson)}
                className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* UP NEXT & RELATED VIDEOS SECTION */}
            <div className="mt-12 mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Related Courses & Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedCourses.map((c) => (
                  <Link key={c._id} to={`/courses/${c._id}`} className="card p-3 hover:border-primary-500/50 transition-all flex flex-col gap-3 group">
                    <img 
                      src={c.thumbnail || 'https://placehold.co/160x90/1e293b/94a3b8?text=Course'} 
                      alt="" 
                      className="w-full h-32 object-cover rounded-xl mt-1" 
                    />
                    <div className="px-1">
                      <h4 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-primary-400 transition-colors">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{c.instructorName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        {/* Lesson Sidebar - Desktop */}
        <div className="hidden lg:block w-80 border-l border-slate-800 bg-dark-900 overflow-hidden">
          <SidebarLessons
            lessons={lessons}
            currentLesson={currentLesson}
            completedLessons={progress.completedLessons}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        {/* Lesson Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden absolute inset-0 z-30 flex">
            <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="w-72 bg-dark-900 border-l border-slate-800 overflow-hidden animate-slide-up">
              <SidebarLessons
                lessons={lessons}
                currentLesson={currentLesson}
                completedLessons={progress.completedLessons}
                onSelectLesson={handleSelectLesson}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;

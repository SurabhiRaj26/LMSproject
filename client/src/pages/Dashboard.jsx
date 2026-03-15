import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProgressAPI, getCoursesAPI, myCoursesAPI } from '../api/api';
import ProgressBar from '../components/ProgressBar';
import {
  LayoutDashboard, BookOpen, GraduationCap, TrendingUp, LogOut,
  PlusCircle, Play, Clock, ChevronRight, Loader2
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progresses, setProgresses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const promises = [getUserProgressAPI(user._id)];
        if (user.role !== 'student') promises.push(myCoursesAPI());
        const results = await Promise.all(promises);
        setProgresses(results[0].data);
        if (results[1]) setMyCourses(results[1].data);
      } catch { }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const completedCourses = progresses.filter((p) => p.percentage === 100);
  const inProgress = progresses.filter((p) => p.percentage > 0 && p.percentage < 100);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    ...(user?.role !== 'student' ? [{ id: 'courses', label: 'My Courses', icon: GraduationCap }] : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-900 border-r border-slate-800 p-5 shrink-0">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Lumina</span>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-slate-800/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => setActiveTab(id)}
              className={`sidebar-link w-full ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}
          <Link to="/courses" className="sidebar-link">
            <BookOpen className="w-5 h-5" /> Browse Courses
          </Link>
        </nav>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2 w-full"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Mobile nav tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === id ? 'bg-primary-600 border-primary-500 text-white' : 'border-slate-700 text-slate-400'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Good to see you, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-slate-500 mt-1">Here's what's happening with your learning.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={BookOpen} label="Enrolled" value={progresses.length} color="bg-primary-600/15 text-primary-400" />
                <StatCard icon={TrendingUp} label="In Progress" value={inProgress.length} color="bg-amber-600/15 text-amber-400" />
                <StatCard icon={GraduationCap} label="Completed" value={completedCourses.length} color="bg-emerald-600/15 text-emerald-400" />
                <StatCard icon={Clock} label="Total Hours" value={`${progresses.length * 3}h`} color="bg-accent-600/15 text-accent-400" />
              </div>

              {/* Continue Learning */}
              {inProgress.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Continue Learning</h2>
                  <div className="space-y-3">
                    {inProgress.slice(0, 3).map((p) => (
                      <div key={p._id} className="card p-4 flex items-center gap-4 hover:border-primary-500/30 transition-all group">
                        <img
                          src={p.courseId?.thumbnail || 'https://placehold.co/80x60/1e293b/94a3b8?text=Course'}
                          alt="" className="w-16 h-12 rounded-lg object-cover shrink-0"
                          onError={(e) => { e.target.src = 'https://placehold.co/80x60/1e293b/94a3b8?text=Course'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate">{p.courseId?.title}</h3>
                          <p className="text-xs text-slate-500 mb-2">{p.courseId?.instructorName}</p>
                          <ProgressBar percentage={p.percentage} label="" />
                        </div>
                        <Link
                          to={`/learn/${p.courseId?._id}`}
                          id={`resume-${p.courseId?._id}`}
                          className="shrink-0 w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <Play className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/courses" id="browse-courses-dash" className="card p-5 flex items-center gap-3 hover:border-primary-500/40 transition-all group">
                  <div className="w-10 h-10 bg-primary-600/15 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">Browse Courses</p>
                    <p className="text-xs text-slate-500">Discover new topics</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                </Link>
                {user?.role !== 'student' && (
                  <button
                    id="create-course-dash"
                    onClick={() => setActiveTab('courses')}
                    className="card p-5 flex items-center gap-3 hover:border-accent-500/40 transition-all group text-left"
                  >
                    <div className="w-10 h-10 bg-accent-600/15 rounded-xl flex items-center justify-center">
                      <PlusCircle className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">Create Course</p>
                      <p className="text-xs text-slate-500">Share your knowledge</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-accent-400 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── My Learning Tab ──────────────────────────────────────────── */}
          {activeTab === 'learning' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">My Learning</h2>
              {progresses.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="btn-primary inline-block mt-4 text-sm">Browse Courses</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {progresses.map((p) => (
                    <div key={p._id} className="card p-5 hover:border-primary-500/30 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={p.courseId?.thumbnail || 'https://placehold.co/60x45/1e293b/94a3b8?text=C'}
                          alt="" className="w-14 h-10 rounded-lg object-cover shrink-0"
                          onError={(e) => { e.target.src = 'https://placehold.co/60x45/1e293b/94a3b8?text=C'; }}
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{p.courseId?.title}</h3>
                          <p className="text-xs text-slate-500">{p.courseId?.instructorName}</p>
                        </div>
                      </div>
                      <ProgressBar percentage={p.percentage} label={`${p.completedLessons?.length || 0} lessons done`} />
                      <Link
                        to={`/learn/${p.courseId?._id}`}
                        id={`learn-${p.courseId?._id}`}
                        className="btn-primary w-full text-center text-sm mt-4 block"
                      >
                        {p.percentage === 100 ? 'Review Course' : 'Continue'}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Progress Tab ─────────────────────────────────────────────── */}
          {activeTab === 'progress' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Learning Progress</h2>
              <div className="space-y-4">
                {progresses.length === 0 ? (
                  <p className="text-slate-500 text-center py-12">No progress data yet. Start a course!</p>
                ) : (
                  progresses.map((p) => (
                    <div key={p._id} className="card p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{p.courseId?.title}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.percentage === 100 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400'}`}>
                          {p.percentage === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <ProgressBar percentage={p.percentage} label={`${p.completedLessons?.length || 0} lessons completed`} />
                      {p.lastWatchedLesson && (
                        <p className="text-xs text-slate-600 mt-2">
                          Last watched: <span className="text-slate-400">{p.lastWatchedLesson.title}</span>
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Instructor Courses Tab ───────────────────────────────────── */}
          {activeTab === 'courses' && user?.role !== 'student' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Courses</h2>
                <Link to="/instructor/create" id="create-new-course-btn" className="btn-primary flex items-center gap-2 text-sm">
                  <PlusCircle className="w-4 h-4" /> New Course
                </Link>
              </div>
              {myCourses.length === 0 ? (
                <div className="text-center py-16 card p-10">
                  <GraduationCap className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">You haven't created any courses yet.</p>
                  <Link to="/instructor/create" className="btn-primary text-sm">Create Your First Course</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCourses.map((c) => (
                    <div key={c._id} className="card p-4 flex items-center gap-4">
                      <img src={c.thumbnail || 'https://placehold.co/80x60/1e293b/94a3b8?text=C'} alt=""
                        className="w-16 h-12 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/80x60/1e293b/94a3b8?text=C'; }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{c.title}</p>
                        <p className="text-xs text-slate-500">{c.totalLessons} lessons · {c.enrolledStudents?.length || 0} students</p>
                      </div>
                      <Link to={`/courses/${c._id}`} className="btn-ghost text-xs">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

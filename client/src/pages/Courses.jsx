import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCoursesAPI } from '../api/api';
import CourseCard from '../components/CourseCard';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'React', 'Backend', 'JavaScript', 'Python', 'Data Science'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;
      const { data } = await getCoursesAPI(params);
      setCourses(data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [category, level]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-dark-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">All Courses</h1>
          <p className="text-slate-500">{loading ? '...' : `${courses.length} courses available`}</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="course-search"
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="input-field pl-10 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary text-sm px-5">Search</button>
          </form>

          <div className="flex gap-3">
            <select
              id="filter-level"
              value={level} onChange={(e) => setLevel(e.target.value)}
              className="input-field text-sm w-auto px-4"
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                ${category === cat
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse">
                <div className="h-40 bg-slate-800 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No courses found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

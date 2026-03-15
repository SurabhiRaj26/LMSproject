import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCourseAPI, createLessonAPI } from '../api/api';
import { PlusCircle, Trash2, ChevronLeft, Loader2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const InstructorCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: '', description: '', thumbnail: '', category: 'Web Development', level: 'Beginner',
  });

  const [lessons, setLessons] = useState([
    { title: '', youtubeId: '', order: 1, description: '' },
  ]);

  const handleCourseChange = (e) => setCourseForm({ ...courseForm, [e.target.name]: e.target.value });

  const handleLessonChange = (index, e) => {
    const updated = [...lessons];
    updated[index][e.target.name] = e.target.value;
    setLessons(updated);
  };

  const addLesson = () => setLessons([...lessons, { title: '', youtubeId: '', order: lessons.length + 1, description: '' }]);
  const removeLesson = (i) => setLessons(lessons.filter((_, idx) => idx !== i));

  const extractYoutubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?/\s]{11})/);
    return match ? match[1] : url;
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.description) return toast.error('Fill all required fields');
    setLoading(true);
    try {
      const { data } = await createCourseAPI(courseForm);
      setCourseId(data._id);
      toast.success('Course created! Now add lessons.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLessons = async (e) => {
    e.preventDefault();
    if (lessons.some((l) => !l.title || !l.youtubeId)) return toast.error('Fill all lesson fields');
    setLoading(true);
    try {
      for (let i = 0; i < lessons.length; i++) {
        await createLessonAPI({
          ...lessons[i],
          courseId,
          youtubeId: extractYoutubeId(lessons[i].youtubeId),
          order: i + 1,
        });
      }
      toast.success('All lessons created! 🎉');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lessons');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Access denied. Instructors only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-1 text-sm mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Course Info', 'Add Lessons'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              {i < 1 && <div className="w-8 h-px bg-slate-700 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: Course Info */}
        {step === 1 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Course Information</h2>
            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Course Title *</label>
                <input id="course-title" name="title" value={courseForm.title} onChange={handleCourseChange}
                  placeholder="e.g. Complete React Developer Course" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                <textarea id="course-description" name="description" value={courseForm.description} onChange={handleCourseChange}
                  placeholder="What will students learn?" rows={4} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Thumbnail URL</label>
                <input id="course-thumbnail" name="thumbnail" value={courseForm.thumbnail} onChange={handleCourseChange}
                  placeholder="https://..." className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                  <select id="course-category" name="category" value={courseForm.category} onChange={handleCourseChange} className="input-field">
                    {['Web Development', 'React', 'Backend', 'JavaScript', 'Python', 'Data Science', 'General'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Level</label>
                  <select id="course-level" name="level" value={courseForm.level} onChange={handleCourseChange} className="input-field">
                    {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button id="create-course-btn" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Create Course & Add Lessons
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Lessons */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Lessons</h2>
              <button id="add-lesson-btn" onClick={addLesson} className="btn-secondary flex items-center gap-2 text-sm">
                <PlusCircle className="w-4 h-4" /> Add Lesson
              </button>
            </div>

            <form onSubmit={handleCreateLessons} className="space-y-4">
              {lessons.map((lesson, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary-400">Lesson {i + 1}</span>
                    {lessons.length > 1 && (
                      <button type="button" onClick={() => removeLesson(i)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      name="title" value={lesson.title} onChange={(e) => handleLessonChange(i, e)}
                      placeholder="Lesson title" className="input-field text-sm"
                    />
                    <input
                      name="youtubeId" value={lesson.youtubeId} onChange={(e) => handleLessonChange(i, e)}
                      placeholder="YouTube URL or Video ID (e.g. https://youtu.be/abc123)" className="input-field text-sm"
                    />
                    <input
                      name="description" value={lesson.description} onChange={(e) => handleLessonChange(i, e)}
                      placeholder="Short description (optional)" className="input-field text-sm"
                    />
                  </div>
                </div>
              ))}

              <button id="save-lessons-btn" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><BookOpen className="w-4 h-4" /> Save All Lessons</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCreate;

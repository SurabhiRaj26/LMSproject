import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Globe, Users, Code, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen text-slate-100 font-sans pb-20">
      
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 mb-8 animate-fade-in text-sm font-semibold text-white/80">
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <span>The Next Generation of Learning</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 leading-[1.1] animate-slide-up">
          Master skills in <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-400 to-indigo-400 animate-pulse-glow">
            absolute clarity.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-12 animate-slide-up-delayed">
          Welcome to Lumina. An ultra-modern, immersive platform designed for creators, developers, and visionaries. Build real projects and elevate your career.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-fade-in-delayed">
          <Link to="/courses" className="btn-primary flex items-center justify-center gap-2 group">
            Explore Courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/signup" className="btn-secondary flex items-center justify-center">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Floating Stats Card ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 -mt-10 relative z-10 animate-fade-in-delayed">
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-12 text-center divide-x divide-white/10">
          {[
            { label: 'Active Students', value: '50K+' },
            { label: 'Expert Instructors', value: '200+' },
            { label: 'Video Lessons', value: '1,500+' },
            { label: 'Success Rate', value: '98%' }
          ].map((stat, i) => (
             <div key={i} className="flex flex-col gap-2">
               <span className="text-4xl md:text-5xl font-extrabold text-white">{stat.value}</span>
               <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
             </div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for the future.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Everything you need to succeed, packed into a beautifully simple interface.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-fuchsia-400" />,
              title: "Lightning Fast",
              desc: "Built on the cutting-edge MERN stack for instant load times and seamless playback."
            },
            {
              icon: <Globe className="w-8 h-8 text-blue-400" />,
              title: "Learn Anywhere",
              desc: "Fully responsive design ensures you can learn on your phone, tablet, or desktop perfectly."
            },
            {
              icon: <Code className="w-8 h-8 text-indigo-400" />,
              title: "Real Projects",
              desc: "We focus on building real-world applications that you can add straight to your portfolio."
            }
          ].map((feature, i) => (
            <div key={i} className="card p-8 flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 drop-shadow-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Container ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-fuchsia-500/20 blur-[100px] pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 relative z-10">Start your journey today.</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto relative z-10">
            Join the Lumina platform and unlock access to premium courses taught by industry veterans.
          </p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2 relative z-10">
             Get Started Free
             <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;

import React from 'react';
import { Play, ArrowRight, GraduationCap, Network, Sparkles, Star, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsSection from '../components/StatsSection';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import DashboardShowcase from '../components/DashboardShowcase';
import HowItWorks from '../components/HowItWorks';
import CourseGraph from '../components/CourseGraph';
import StudentJourney from '../components/StudentJourney';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem('userName');
  const userRole = localStorage.getItem('role');
  const authRoute = isLoggedIn ? (userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard') : '/login';

  return (
    <div className="bg-transparent font-sans overflow-x-hidden relative transition-colors duration-500">
      
      {/* Hero Wrapper - Solid background to hide 3D effect */}
      <div className="bg-[#05050A] text-white relative min-h-screen w-full flex flex-col overflow-hidden border-b border-white/5">
        {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.25), transparent 30%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.25), transparent 30%)' }}></div>
      


      {/* Floating abstract lines/nodes - simplified */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-0"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-0"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">CourseFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
          <Link to={authRoute} className="hidden sm:block text-white/70 hover:text-white transition-colors active:scale-95">{isLoggedIn ? 'Dashboard' : 'Sign In'}</Link>
          <Link to={authRoute} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 font-semibold whitespace-nowrap text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" /> {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-20 pb-20 sm:pb-32 flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
        
        {/* Left Column */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-semibold tracking-wider text-white/70 mb-8 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI-Powered Academic Planning
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-6 break-words">
            <div className="text-white">Plan Smarter.</div>
            <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Graduate Faster.</div>
          </h1>
          
          <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
            Transform course registration into an intelligent experience using graph algorithms, prerequisite visualization, and personalized learning paths.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full">
            <Link to={authRoute} className="w-full sm:w-auto justify-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all active:scale-95">
              {isLoggedIn ? 'Enter Dashboard' : 'Get Started'} <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full sm:w-auto justify-center px-8 py-4 rounded-full bg-white/[0.03] border border-white/10 text-white font-semibold flex items-center gap-2 hover:bg-white/[0.08] transition-all active:scale-95">
              <Play className="w-4 h-4" fill="currentColor" /> Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Trusted By Students Worldwide</span>
          </div>
        </div>

        {/* Right Column - Dashboard UI Mockup */}
        <div className="flex-1 w-full relative h-[350px] sm:h-[450px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0 scale-[0.7] sm:scale-75 lg:scale-100 origin-top lg:origin-center hidden sm:flex">
          <div className="relative w-full max-w-lg lg:ml-10">
            
            {/* Card 1: Degree Completion */}
            <div className="absolute top-0 right-0 w-[360px] bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 transform translate-x-12 -translate-y-16">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Degree Completion</span>
                <GraduationCap className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex items-end justify-between mb-3">
                <span className="text-4xl font-black">78%</span>
                <span className="text-sm text-white/50">on track</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"></div>
              </div>
            </div>

            {/* Card 2: Prerequisite Graph */}
            <div className="relative w-[380px] bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl z-20 mt-16">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">Prerequisite Graph</span>
                <Network className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="px-3 py-1.5 bg-white/5 rounded border border-white/10 text-sm font-medium">CS101</div>
                <ArrowRight className="w-4 h-4 text-white/30" />
                <div className="px-3 py-1.5 bg-white/5 rounded border border-white/10 text-sm font-medium">CS102</div>
                <ArrowRight className="w-4 h-4 text-white/30" />
                <div className="px-3 py-1.5 bg-white/10 rounded border border-white/20 text-sm font-medium text-cyan-300">DBMS</div>
                <ArrowRight className="w-4 h-4 text-white/30" />
                <div className="px-3 py-1.5 bg-white/5 rounded border border-white/10 text-sm font-medium opacity-50">AI</div>
              </div>
            </div>

            {/* Card 3: Suggested Next */}
            <div className="absolute bottom-0 right-4 w-[340px] bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl z-30 transform translate-y-32">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Suggested Next</span>
                <Sparkles className="w-4 h-4 text-white/40" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Operating Systems', fit: '98%' },
                  { name: 'Computer Networks', fit: '94%' },
                  { name: 'Machine Learning', fit: '91%' },
                ].map((course, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{course.name}</span>
                    <span className="font-mono text-cyan-400 text-xs">{course.fit} fit</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Semester Planner */}
            <div className="absolute -bottom-16 left-0 w-[280px] bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl z-40 transform translate-y-40 -translate-x-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Semester Planner</span>
                <span className="text-2xl font-black">18<span className="text-base text-white/40 font-medium">/20</span></span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-white/50">Fall · Credits</span>
                <span className="text-emerald-400">BALANCED</span>
              </div>
            </div>

          </div>
        </div>
      </main>
      </div>

      {/* Content Below Hero - Transparent to show 3D canvas */}
      <div className="bg-transparent relative z-10">
        <StatsSection />
        <ProblemSolution />
        <div id="features"><Features /></div>
        <div id="dashboard"><DashboardShowcase /></div>
        <HowItWorks />
        <div id="roadmap"><CourseGraph /></div>
        <StudentJourney />
        <Testimonials />
        <FAQ />
        <div id="pricing"><CTASection /></div>
        <Footer />
      </div>
    </div>
  );
}

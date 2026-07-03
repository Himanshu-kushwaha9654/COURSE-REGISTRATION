import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen, Clock, Building, Tag } from 'lucide-react';
import axios from 'axios';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`https://course-registration-production-967c.up.railway.app/api/courses/${id}`, { withCredentials: true });
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div><p>Loading course details...</p></div></div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-red-500 font-bold">Course not found.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/dashboard/admin/courses" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 hover:text-indigo-500 transition-colors mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Course Management
      </Link>
      
      <div className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-500 font-bold text-xs tracking-wider border border-indigo-500/30">
                {course.courseCode}
              </span>
              <span className="px-3 py-1 rounded-md bg-[var(--glass-bg)] border border-[var(--glass-border)] font-semibold text-xs opacity-70">
                Semester {course.semester}
              </span>
              <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
                {course.credits} Credits
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black mb-4">{course.courseName}</h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 opacity-60 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" /> {course.program?.university?.name} ({course.program?.name})
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" /> {course.department} Department
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> {course.courseType}
              </div>
            </div>
          </div>
          
          {course.sourceUrl && (
            <a 
              href={course.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-colors font-semibold text-sm whitespace-nowrap"
            >
              Official Syllabus <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-500 rounded-full"></div> Description
            </h2>
            <div className="opacity-80 leading-relaxed text-sm">
              {course.description ? (
                course.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))
              ) : (
                <p className="italic opacity-50">No description available for this course.</p>
              )}
            </div>
          </section>
          
          <section className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-cyan-500 rounded-full"></div> Complete Syllabus
            </h2>
            <div className="opacity-80 leading-relaxed text-sm whitespace-pre-wrap">
              {course.syllabus ? course.syllabus : <p className="italic opacity-50">Syllabus details are not available yet.</p>}
            </div>
          </section>
        </div>
        
        <div className="space-y-8">
          <section className="glass-panel rounded-3xl p-6">
            <h3 className="font-bold mb-4">Course Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                <span className="opacity-50">Code</span>
                <span className="font-bold">{course.courseCode}</span>
              </li>
              <li className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                <span className="opacity-50">Credits</span>
                <span className="font-bold">{course.credits}</span>
              </li>
              <li className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                <span className="opacity-50">Semester</span>
                <span className="font-bold">{course.semester}</span>
              </li>
              <li className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                <span className="opacity-50">Type</span>
                <span className="font-bold">{course.courseType}</span>
              </li>
              <li className="flex justify-between pb-2">
                <span className="opacity-50">Department</span>
                <span className="font-bold">{course.department}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

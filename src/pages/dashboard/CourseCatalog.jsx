import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Library, Search, Filter, BookOpen, Clock, Star, ArrowRight, RefreshCw, X } from 'lucide-react';
import api from '../../api/axiosConfig';

let globalCoursesCache = null;

export default function CourseCatalog() {
  const [courses, setCourses] = useState(globalCoursesCache || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  
  const [universities, setUniversities] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [semesters, setSemesters] = useState([]);

  const [loading, setLoading] = useState(!globalCoursesCache);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    try {
      setEnrollLoading(true);
      setEnrollResult(null);
      const res = await api.post(`/enrollments?courseId=${selectedCourse.id}`);
      setEnrollResult({ type: 'success', status: res.data.status, message: res.data.rejectionReason || `Successfully processed: ${res.data.status}` });
    } catch (e) {
      setEnrollResult({ type: 'error', message: e.response?.data || 'Failed to enroll' });
    } finally {
      setEnrollLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (force = false) => {
    try {
      if (!force && globalCoursesCache) {
        setCourses(globalCoursesCache);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await api.get('/courses');
      globalCoursesCache = res.data;
      setCourses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courses.length) return;
    const univs = new Set();
    const progMap = {};
    const sems = new Set();
    
    courses.forEach(course => {
      if (course.program?.university?.name) {
        const uName = course.program.university.name;
        univs.add(uName);
        if (!progMap[uName]) progMap[uName] = new Set();
        if (course.program.name) progMap[uName].add(course.program.name);
      }
      if (course.semester) {
        sems.add(course.semester);
      }
    });
    
    const sortedUnivs = Array.from(univs).sort();
    const sortedSems = Array.from(sems).sort((a,b) => a - b);
    Object.keys(progMap).forEach(k => {
      progMap[k] = Array.from(progMap[k]).sort();
    });

    setUniversities(sortedUnivs);
    setProgramsMap(progMap);
    setSemesters(sortedSems);
  }, [courses]);

  const handleUniversityChange = (e) => {
    const u = e.target.value;
    setFilterUniversity(u);
    setFilterProgram(''); // Reset program when university changes
  };

  const departments = useMemo(() => [...new Set(courses.map(c => c.department).filter(Boolean))], [courses]);
  const types = useMemo(() => [...new Set(courses.map(c => c.courseType).filter(Boolean))], [courses]);

  const handleRefresh = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterType('');
    setFilterUniversity('');
    setFilterProgram('');
    setFilterSemester('');
    fetchCourses(true); // Force network request in background
  };

  const filteredCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = (course.courseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (course.courseCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesDept = filterDepartment ? course.department === filterDepartment : true;
      const matchesType = filterType ? course.courseType === filterType : true;
      const matchesUniv = filterUniversity ? course.program?.university?.name === filterUniversity : true;
      const matchesProg = filterProgram ? course.program?.name === filterProgram : true;
      const matchesSem = filterSemester ? course.semester === parseInt(filterSemester) : true;
      
      return matchesSearch && matchesDept && matchesType && matchesUniv && matchesProg && matchesSem;
    });
    
    // Sort by semester ascending
    result.sort((a, b) => (a.semester || 0) - (b.semester || 0));
    
    return result;
  }, [courses, searchTerm, filterDepartment, filterType, filterUniversity, filterProgram, filterSemester]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterType, filterUniversity, filterProgram, filterSemester]);

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-3 flex items-center gap-3"><Library className="text-indigo-500" /> Course Catalog</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Discover and enroll in university courses for your curriculum.</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 mb-8 shadow-xl flex flex-col gap-4 z-10 relative">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input 
              type="text" 
              placeholder="Search by course name or code (e.g. CS101)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all" 
            />
          </div>
          <button 
            onClick={handleRefresh}
            className="w-14 h-14 flex items-center justify-center bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-2xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors shadow-inner text-slate-400 focus:outline-none shrink-0"
            title="Refresh Courses"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <select 
            value={filterUniversity} 
            onChange={handleUniversityChange}
            className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer shadow-inner"
          >
            <option value="">All Universities</option>
            {universities.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          <select 
            value={filterProgram} 
            onChange={e => setFilterProgram(e.target.value)}
            className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer shadow-inner"
          >
            <option value="">All Programs</option>
            {(programsMap[filterUniversity] || []).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <select 
            value={filterSemester} 
            onChange={e => setFilterSemester(e.target.value)}
            className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer shadow-inner"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select 
            value={filterDepartment} 
            onChange={e => setFilterDepartment(e.target.value)}
            className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer shadow-inner"
          >
            <option value="">All Departments</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
          
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer shadow-inner"
          >
            <option value="">All Types</option>
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {loading && courses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading university curriculum...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {paginatedCourses.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="glass-panel rounded-3xl p-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col border border-[var(--glass-border)] relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-bold tracking-wider uppercase border border-indigo-500/20">
                  {course.courseCode}
                </span>
                <span className="text-xs font-medium bg-[var(--glass-border)] px-2 py-1 rounded-md text-slate-500">
                  Sem {course.semester}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-indigo-500 transition-colors relative z-10 line-clamp-2">
                {course.courseName}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3 relative z-10">
                {course.description || 'No description available for this course.'}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)] mt-auto relative z-10">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" /> {course.credits} Cr
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <BookOpen className="w-4 h-4 text-emerald-500" /> {course.department}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
              <Search className="w-16 h-16 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No courses found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg disabled:opacity-50 hover:bg-indigo-500/10 transition-colors font-medium"
          >
            Previous
          </button>
          <span className="text-slate-400 font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg disabled:opacity-50 hover:bg-indigo-500/10 transition-colors font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* Floating Centered Modal */}
      {selectedCourse && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => { setSelectedCourse(null); setEnrollResult(null); }}
          ></div>
          
          {/* Modal Content */}
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-[2rem] relative z-10 flex flex-col overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent relative">
              <button 
                onClick={() => { setSelectedCourse(null); setEnrollResult(null); }}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="pr-12">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm font-bold tracking-wider shadow-lg shadow-indigo-500/30">
                    {selectedCourse.courseCode}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-indigo-200">
                    {selectedCourse.department}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-medium">
                    Semester {selectedCourse.semester}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white">{selectedCourse.courseName}</h2>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-black/20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white"><BookOpen className="text-indigo-400 w-5 h-5" /> Course Description</h3>
                    <p className="text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                      {selectedCourse.description || 'Detailed description not provided.'}
                    </p>
                  </div>
                  
                  {selectedCourse.syllabus && (
                    <div>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white"><BookOpen className="text-indigo-400 w-5 h-5" /> Syllabus Overview</h3>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm shadow-inner max-h-80 overflow-y-auto custom-scrollbar">
                        {selectedCourse.syllabus}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                    <h3 className="font-bold mb-4 text-lg border-b border-white/10 pb-2 text-white">Quick Facts</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <span className="text-slate-400">Credits</span>
                        <span className="font-bold text-lg text-white">{selectedCourse.credits}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-400">Type</span>
                        <span className="font-bold text-white">{selectedCourse.courseType || 'Core'}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-400">University</span>
                        <span className="font-bold text-right text-sm max-w-[150px] truncate text-white" title={selectedCourse.program?.university?.name}>
                          {selectedCourse.program?.university?.name || 'N/A'}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-400">Program</span>
                        <span className="font-bold text-right text-sm max-w-[150px] truncate text-white" title={selectedCourse.program?.name}>
                          {selectedCourse.program?.name || 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {selectedCourse.sourceUrl && (
                    <a 
                      href={selectedCourse.sourceUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-sm text-white"
                    >
                      View Official Syllabus <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  
                  {enrollResult && (
                    <div className={`w-full p-4 rounded-xl text-sm font-medium ${enrollResult.type === 'success' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                      {enrollResult.message}
                    </div>
                  )}
                  
                  <button 
                    onClick={handleEnroll}
                    disabled={enrollLoading || (enrollResult && enrollResult.type === 'success')}
                    className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    {enrollLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Enroll in Course'}
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

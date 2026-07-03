import React, { useState, useMemo } from 'react';
import { Database, Plus, Search, Edit2, Trash2, X, Filter, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import useSWR from 'swr';

const fetcher = url => api.get(url).then(res => res.data);

export default function CourseManager() {
  const { data: courses = [], mutate } = useSWR('/courses', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, courseCode: '', courseName: '', credits: 3, semester: 1, maxSeats: 60, description: '' });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleRefresh = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterType('');
    mutate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/courses/${formData.id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      setIsModalOpen(false);
      mutate();
    } catch (e) {
      alert(e.response?.data || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure?")) {
      try {
        await api.delete(`/courses/${id}`);
        mutate();
      } catch(e) {
        alert("Failed to delete");
      }
    }
  };

  const openEdit = (course) => {
    setFormData(course);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setFormData({ id: null, courseCode: '', courseName: '', credits: 3, semester: 1, maxSeats: 60, description: '' });
    setIsModalOpen(true);
  };

  // Extract unique departments and types for filters
  const departments = [...new Set(courses.map(c => c.department).filter(Boolean))];
  const types = [...new Set(courses.map(c => c.courseType).filter(Boolean))];

  const filteredCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = (course.courseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (course.courseCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesDept = filterDepartment ? course.department === filterDepartment : true;
      const matchesType = filterType ? course.courseType === filterType : true;
      
      return matchesSearch && matchesDept && matchesType;
    });

    // Sort by semester ascending
    result.sort((a, b) => (a.semester || 0) - (b.semester || 0));

    return result;
  }, [courses, searchTerm, filterDepartment, filterType]);

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Database className="text-indigo-400" /> Course Manager</h1>
          <p className="text-slate-400">Manage the global curriculum catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/admin/import" className="px-5 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Import Excel
          </Link>
          <button onClick={openNew} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-[var(--glass-border)] flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="p-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors focus:outline-none text-slate-400"
              title="Refresh and Clear Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Filter className="w-4 h-4 opacity-50 ml-2" />
            <select 
              value={filterDepartment} 
              onChange={e => setFilterDepartment(e.target.value)}
              className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Types</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--bg-color)] z-10">
              <tr className="border-b border-[var(--glass-border)]">
                <th className="p-4 font-semibold opacity-50 text-xs uppercase tracking-wider">Code</th>
                <th className="p-4 font-semibold opacity-50 text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold opacity-50 text-xs uppercase tracking-wider">Program</th>
                <th className="p-4 font-semibold opacity-50 text-xs uppercase tracking-wider">Dept</th>
                <th className="p-4 font-semibold opacity-50 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} className="border-b border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors group">
                  <td className="p-4 font-bold text-indigo-500">
                    <Link to={`/dashboard/admin/courses/${course.id}`} className="hover:underline">
                      {course.courseCode}
                    </Link>
                  </td>
                  <td className="p-4 font-medium">
                    <Link to={`/dashboard/admin/courses/${course.id}`} className="hover:text-indigo-500 transition-colors">
                      {course.courseName}
                    </Link>
                  </td>
                  <td className="p-4 text-sm opacity-80">{course.program?.name || 'N/A'}</td>
                  <td className="p-4 text-sm opacity-80">{course.department || 'N/A'}</td>
                  <td className="p-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(course)} className="p-2 hover:bg-indigo-500/20 text-indigo-500 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center opacity-50 italic">No courses found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100 rounded-full hover:bg-[var(--glass-bg)] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit Course' : 'New Course'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm opacity-50 mb-1">Course Code</label>
                <input required type="text" value={formData.courseCode} onChange={e => setFormData({...formData, courseCode: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm opacity-50 mb-1">Course Name</label>
                <input required type="text" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm opacity-50 mb-1">Credits</label>
                  <input required type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm opacity-50 mb-1">Semester</label>
                  <input required type="number" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm opacity-50 mb-1">Max Seats</label>
                  <input required type="number" value={formData.maxSeats} onChange={e => setFormData({...formData, maxSeats: parseInt(e.target.value)})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm opacity-50 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:border-indigo-500 outline-none h-24 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-white transition-colors mt-2">
                {formData.id ? 'Save Changes' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

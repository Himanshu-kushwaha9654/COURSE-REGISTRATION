import React, { useState, useEffect } from 'react';
import { User, Search, Eye, FileText, X, BookOpen, Map, PieChart } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.program?.university?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><User className="text-indigo-400" /> Student Management</h1>
          <p className="text-slate-400">Monitor academic progress and manage student records.</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-[var(--glass-border)]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name, email, or university..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-[var(--glass-border)] text-sm">
                <th className="p-4 font-semibold text-slate-400">Student Name</th>
                <th className="p-4 font-semibold text-slate-400">University / Program</th>
                <th className="p-4 font-semibold text-slate-400 text-center">Semester</th>
                <th className="p-4 font-semibold text-slate-400 text-center">Credits / CGPA</th>
                <th className="p-4 font-semibold text-slate-400 text-right">Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{student.fullName}</p>
                    <p className="text-xs text-indigo-300">{student.email}</p>
                  </td>
                  <td className="p-4">
                    {student.profileComplete ? (
                      <>
                        <p className="font-medium text-sm text-slate-300">{student.program?.university?.name}</p>
                        <p className="text-xs text-slate-500">{student.program?.name}</p>
                      </>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-md border border-amber-500/20">Onboarding Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold text-slate-300">
                    {student.currentSemester || '-'}
                  </td>
                  <td className="p-4 text-center">
                    <p className="text-sm font-bold">{student.totalCredits || 0} <span className="text-xs text-slate-500 font-normal">Cr</span></p>
                    <p className="text-xs text-emerald-400 font-bold">GPA: {student.cgpa || '0.0'}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-bold border border-indigo-500/20 transition-colors inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No students found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-0 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-transparent border-b border-[var(--glass-border)] flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-500/40">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                  <p className="text-indigo-300">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert('Transcript generated successfully! (Mock)')}
                  className="px-4 py-2 bg-[var(--glass-bg)] hover:bg-white/10 border border-[var(--glass-border)] rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Generate Transcript
                </button>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-[var(--glass-border)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Academic Info */}
                <div className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)]">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-[var(--glass-border)] pb-2"><Map className="w-5 h-5 text-indigo-400" /> Academic Profile</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">University</span>
                      <span className="font-medium text-right">{selectedStudent.program?.university?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Program</span>
                      <span className="font-medium text-right">{selectedStudent.program?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Semester</span>
                      <span className="font-bold">{selectedStudent.currentSemester || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)]">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-[var(--glass-border)] pb-2"><PieChart className="w-5 h-5 text-emerald-400" /> Performance Stats</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-emerald-400">{selectedStudent.cgpa || '0.0'}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">CGPA</span>
                    </div>
                    <div className="flex-1 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-blue-400">{selectedStudent.totalCredits || '0'}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Credits</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Library, Download, FileText, FileSpreadsheet, FileIcon } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function ReportsCenter() {
  const downloadReport = async (url, filename) => {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download report", error);
      alert("Failed to download report.");
    }
  };

  return (
    <div className="p-8 pb-32 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Library className="text-pink-400" /> Reports Center</h1>
        <p className="text-slate-400">Generate and download CSV reports for platform data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileSpreadsheet className="w-24 h-24 text-teal-400" />
          </div>
          <div className="p-3 bg-teal-500/10 rounded-xl inline-block mb-4">
            <FileSpreadsheet className="w-6 h-6 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Course Master List</h3>
          <p className="text-sm text-slate-400 mb-6">Complete export of all courses, credits, and semester assignments.</p>
          <button 
            onClick={() => downloadReport('/reports/courses/csv', 'courses_report.csv')}
            className="w-full py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>

        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <UsersIcon className="w-24 h-24 text-indigo-400" />
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl inline-block mb-4">
            <User className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Student Roster</h3>
          <p className="text-sm text-slate-400 mb-6">Export of all registered students, their roles, and email addresses.</p>
          <button 
            onClick={() => downloadReport('/reports/students/csv', 'students_report.csv')}
            className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>

      </div>
    </div>
  );
}

// Quick icons fix
import { Users as UsersIcon, User } from 'lucide-react';

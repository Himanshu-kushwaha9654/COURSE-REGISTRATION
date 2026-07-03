import React, { useState } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function ImportDataset() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPreviewData([]);
      setSummary(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPreviewData(response.data);
    } catch (error) {
      console.error('Error previewing file', error);
      alert('Failed to preview file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/import/execute', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSummary(response.data);
      setPreviewData([]); // Clear preview after successful import
    } catch (error) {
      console.error('Error importing file', error);
      alert('Failed to import dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status.includes('New')) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status.includes('Existing')) return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusClass = (status) => {
    if (status.includes('New')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (status.includes('Existing')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Import Curriculum Dataset</h1>
        <p className="opacity-50">Upload an Excel (.xlsx) file to batch import or update courses.</p>
      </div>

      {summary ? (
        <div className="glass-panel rounded-3xl p-8 max-w-2xl mx-auto text-center border-emerald-500/30">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Import Successful!</h2>
          <p className="opacity-50 mb-8">Your dataset has been imported into the database.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-indigo-500">{summary.importedCourses}</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Courses Added</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-amber-500">{summary.updatedCourses}</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Courses Updated</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-red-500">{summary.skippedRows}</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Rows Skipped</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-cyan-500">{summary.universitiesAdded}</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Universities Added</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-purple-500">{summary.programsAdded}</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Programs Added</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-[var(--glass-bg)] border-[var(--glass-border)]">
              <div className="text-3xl font-bold text-emerald-500">{summary.timeTakenSeconds.toFixed(2)}s</div>
              <div className="text-xs opacity-50 uppercase tracking-wider font-semibold mt-1">Time Taken</div>
            </div>
          </div>
          
          <button 
            onClick={() => { setSummary(null); setFile(null); }}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Import Another File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-8 text-center border-dashed border-2 border-[var(--glass-border)]">
            <UploadCloud className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Select Dataset</h3>
            <p className="opacity-50 text-sm mb-6 max-w-md mx-auto">
              Please ensure your Excel file has the correct columns: University, Program, Semester, Course Code, Course Name, Credits, Department, Course Type, Description, Syllabus, Source URL.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <label className="cursor-pointer px-6 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-colors font-semibold flex items-center gap-2">
                <FileType className="w-5 h-5" />
                {file ? file.name : "Browse Files"}
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} />
              </label>
              
              {file && previewData.length === 0 && (
                <button 
                  onClick={handlePreview}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Preview Data
                </button>
              )}
            </div>
          </div>

          {previewData.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 overflow-hidden flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Data Preview ({previewData.length} rows)</h3>
                <button 
                  onClick={handleImport}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Confirm & Import
                </button>
              </div>
              
              <div className="flex-1 overflow-auto rounded-xl border border-[var(--glass-border)]">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 bg-[var(--bg-color)] z-10 border-b border-[var(--glass-border)]">
                    <tr>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Status</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Course Code</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Course Name</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Program</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">University</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Sem</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Credits</th>
                      <th className="p-4 text-xs uppercase opacity-50 font-semibold tracking-wider">Dept</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-[var(--glass-bg)] transition-colors">
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getStatusClass(row.status)}`}>
                            {getStatusIcon(row.status)} {row.status}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-bold">{row.courseCode}</td>
                        <td className="p-4 text-sm">{row.courseName}</td>
                        <td className="p-4 text-sm opacity-80">{row.programName}</td>
                        <td className="p-4 text-sm opacity-80">{row.universityName}</td>
                        <td className="p-4 text-sm">{row.semester}</td>
                        <td className="p-4 text-sm">{row.credits}</td>
                        <td className="p-4 text-sm opacity-80">{row.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

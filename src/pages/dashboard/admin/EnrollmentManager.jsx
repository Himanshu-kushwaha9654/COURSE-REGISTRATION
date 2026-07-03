import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, Clock, AlertTriangle, User, RefreshCw } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function EnrollmentManager() {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments');
      setEnrollments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/enrollments/${id}/approve`);
      setSelectedEnrollment(null);
      fetchData();
    } catch (e) {
      alert(e.response?.data || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    try {
      await api.post(`/enrollments/${id}/reject`, rejectReason, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setSelectedEnrollment(null);
      setRejectReason('');
      fetchData();
    } catch (e) {
      alert(e.response?.data || "Failed to reject");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">PENDING</span>;
      case 'APPROVED': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">APPROVED</span>;
      case 'REJECTED': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">REJECTED</span>;
      case 'WAITLISTED': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">WAITLISTED</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><BookOpen className="text-purple-400" /> Enrollment Management</h1>
          <p className="text-slate-400">Review pending enrollment requests, waitlists, and approvals.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-purple-500/20 hover:text-purple-400 transition-colors px-4 py-2 rounded-xl text-sm font-bold text-slate-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* List Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden flex flex-col h-fit max-h-[70vh]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0f172a] z-10 shadow-md">
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="p-4 font-semibold text-slate-400">Student</th>
                  <th className="p-4 font-semibold text-slate-400">Course</th>
                  <th className="p-4 font-semibold text-slate-400">Date</th>
                  <th className="p-4 font-semibold text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.sort((a,b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)).map(en => (
                  <tr 
                    key={en.id} 
                    onClick={() => setSelectedEnrollment(en)}
                    className={`border-b border-[var(--glass-border)] transition-colors cursor-pointer ${selectedEnrollment?.id === en.id ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}
                  >
                    <td className="p-4">
                      <div className="font-bold">{en.student.fullName}</div>
                      <div className="text-xs text-slate-400">{en.student.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-purple-300 font-bold">{en.course.courseCode}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{en.course.courseName}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{new Date(en.enrolledAt).toLocaleDateString()}</td>
                    <td className="p-4">{getStatusBadge(en.status)}</td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No enrollment records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel rounded-3xl p-6 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[var(--glass-border)] pb-4">
            <User className="text-purple-400 w-5 h-5" /> Decision Panel
          </h2>
          
          {selectedEnrollment ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Request Details</h3>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="mb-2"><span className="text-slate-500">Student:</span> {selectedEnrollment.student.fullName}</div>
                  <div className="mb-2"><span className="text-slate-500">Course:</span> {selectedEnrollment.course.courseCode} - {selectedEnrollment.course.courseName}</div>
                  <div className="mb-2"><span className="text-slate-500">Current Status:</span> {getStatusBadge(selectedEnrollment.status)}</div>
                  {selectedEnrollment.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>{selectedEnrollment.rejectionReason}</div>
                    </div>
                  )}
                  {selectedEnrollment.waitlistPosition && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm flex items-start gap-2">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>Waitlist Position: #{selectedEnrollment.waitlistPosition}</div>
                    </div>
                  )}
                </div>
              </div>

              {selectedEnrollment.status === 'PENDING' && (
                <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Rejection Reason (if rejecting)</label>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Missing prerequisite..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 h-24 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleReject(selectedEnrollment.id)}
                      className="py-2.5 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedEnrollment.id)}
                      className="py-2.5 bg-green-500/20 hover:bg-green-500 border border-green-500/50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 flex flex-col items-center">
              <BookOpen className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an enrollment request from the list to view details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

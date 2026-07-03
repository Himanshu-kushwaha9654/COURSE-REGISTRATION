import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments/my');
      setEnrollments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><Clock className="w-3 h-3" /> PENDING</span>;
      case 'APPROVED': return <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30"><CheckCircle className="w-3 h-3" /> APPROVED</span>;
      case 'REJECTED': return <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"><XCircle className="w-3 h-3" /> REJECTED</span>;
      case 'WAITLISTED': return <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30"><Clock className="w-3 h-3" /> WAITLISTED</span>;
      default: return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-3 flex items-center gap-3"><BookOpen className="text-indigo-500" /> My Registrations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Track the status of all your course enrollments and history.</p>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your enrollments...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Registrations Yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">You haven't requested enrollment for any courses. Head over to the catalog to start planning your semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.sort((a,b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)).map(enrollment => (
            <div key={enrollment.id} className="glass-panel rounded-3xl p-6 border border-[var(--glass-border)] relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-bold tracking-wider uppercase border border-indigo-500/20 mr-2">
                    {enrollment.course.courseCode}
                  </span>
                  <span className="text-xs font-medium text-slate-500">Sem {enrollment.course.semester}</span>
                </div>
                {getStatusBadge(enrollment.status)}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{enrollment.course.courseName}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{enrollment.course.description}</p>
              
              <div className="mt-auto">
                {enrollment.status === 'REJECTED' && enrollment.rejectionReason && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2 mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Rejection Reason:</span>
                      {enrollment.rejectionReason}
                    </div>
                  </div>
                )}
                {enrollment.status === 'WAITLISTED' && enrollment.waitlistPosition && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm flex items-center gap-2 mt-4">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="font-bold">Waitlist Position: #{enrollment.waitlistPosition}</span>
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-[var(--glass-border)]">
                  Requested on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

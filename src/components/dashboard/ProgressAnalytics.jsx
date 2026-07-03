import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function ProgressAnalytics() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments/my');
        setEnrollments(res.data.filter(e => e.status === 'APPROVED' || e.status === 'COMPLETED'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const chartData = useMemo(() => {
    const semesterMap = {};
    enrollments.forEach(e => {
      const sem = e.course?.semester || 0;
      if (!semesterMap[sem]) semesterMap[sem] = 0;
      semesterMap[sem] += (e.course?.credits || 0);
    });
    return Object.entries(semesterMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([sem, credits]) => ({ name: `Sem ${sem}`, credits }));
  }, [enrollments]);

  return (
    <div className="glass-panel rounded-2xl p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><PieIcon className="w-5 h-5 text-pink-500"/> Progress Analytics</h3>
      <div className="flex-1 w-full text-xs">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm opacity-50">
            No enrollment data yet. Enroll in courses to see your progress!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="name" stroke="#888" axisLine={false} tickLine={false} />
              <YAxis stroke="#888" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'var(--glass-bg)'}} contentStyle={{background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--glass-border)', borderRadius: '8px'}} />
              <Bar dataKey="credits" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
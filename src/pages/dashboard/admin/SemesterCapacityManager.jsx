import React, { useState } from 'react';
import { Calendar, Plus, Save, Trash2 } from 'lucide-react';
import api from '../../../api/axiosConfig';
import useSWR from 'swr';

const fetcher = url => api.get(url).then(res => res.data);

export default function SemesterCapacityManager() {
  const { data: capacities = [], mutate } = useSWR('/capacities', fetcher);
  const [semester, setSemester] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/capacities', { semester: parseInt(semester), maxCapacity: parseInt(maxCapacity) });
      mutate();
      setSemester('');
      setMaxCapacity('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 pb-32 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Calendar className="text-orange-400" /> Semester Capacity (Credit Limits)</h1>
        <p className="text-slate-400">Manage the maximum number of credits a student is allowed to take in a specific semester.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="text-orange-400" /> Set Capacity
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Semester</label>
              <input 
                type="number" 
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Max Credits</label>
              <input 
                type="number" 
                value={maxCapacity}
                onChange={e => setMaxCapacity(e.target.value)}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Capacity
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--glass-border)] bg-black/20">
                  <th className="p-4 font-semibold text-slate-400">Semester</th>
                  <th className="p-4 font-semibold text-slate-400">Max Credits Allowed</th>
                  <th className="p-4 font-semibold text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {capacities.map(cap => (
                  <tr key={cap.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">Semester {cap.semester}</td>
                    <td className="p-4"><span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg font-bold">{cap.maxCapacity}</span></td>
                    <td className="p-4 text-right">
                      {/* Normally a delete button here, but maybe capacity doesn't need delete, just update */}
                    </td>
                  </tr>
                ))}
                {capacities.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-500">No capacities defined yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

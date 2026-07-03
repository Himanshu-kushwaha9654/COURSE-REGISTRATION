import React from 'react';
import ProgressAnalytics from '../../components/dashboard/ProgressAnalytics';

export default function AnalyticsView() {
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Analytics</h1>
        <p className="text-white/50">Track your academic progress and degree velocity.</p>
      </div>
      <div className="max-w-2xl">
        <ProgressAnalytics />
      </div>
    </div>
  );
}

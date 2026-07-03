import React from 'react';
import SemesterPlanner from '../../components/dashboard/SemesterPlanner';
import EligibilityChecker from '../../components/dashboard/EligibilityChecker';

export default function PlannerView() {
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Semester Planner</h1>
        <p className="text-white/50">Optimize your credit load and check course eligibility.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SemesterPlanner />
        <EligibilityChecker />
      </div>
    </div>
  );
}

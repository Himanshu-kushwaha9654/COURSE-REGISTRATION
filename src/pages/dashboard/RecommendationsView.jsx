import React from 'react';
import RecommendationEngine from '../../components/dashboard/RecommendationEngine';

export default function RecommendationsView() {
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Smart Recommendations</h1>
        <p className="text-white/50">AI-powered course suggestions based on your completion history.</p>
      </div>
      <RecommendationEngine />
    </div>
  );
}

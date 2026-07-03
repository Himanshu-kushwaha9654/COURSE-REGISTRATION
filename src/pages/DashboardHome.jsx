import React from 'react';
import { motion } from 'framer-motion';
import HeroProgress from '../components/dashboard/HeroProgress';
import RecommendationEngine from '../components/dashboard/RecommendationEngine';
import DependencyGraph from '../components/dashboard/DependencyGraph';
import RoadmapTimeline from '../components/dashboard/RoadmapTimeline';
import EligibilityChecker from '../components/dashboard/EligibilityChecker';
import SemesterPlanner from '../components/dashboard/SemesterPlanner';
import AIAssistant from '../components/dashboard/AIAssistant';
import ProgressAnalytics from '../components/dashboard/ProgressAnalytics';
import AlgorithmPlayground from '../components/dashboard/AlgorithmPlayground';
import ActivityAndUpcoming from '../components/dashboard/ActivityAndUpcoming';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardHome() {
  return (
    <motion.div 
      className="pb-32"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Section 1: Hero Progress */}
      <motion.div variants={item}><HeroProgress /></motion.div>

      {/* Section 2: Recommendation Engine */}
      <motion.div variants={item}><RecommendationEngine /></motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Main Left Column (Graph, Timeline, Algo Playground) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={item}><AlgorithmPlayground /></motion.div>
          <motion.div variants={item}><DependencyGraph /></motion.div>
          <motion.div variants={item}><RoadmapTimeline /></motion.div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          <motion.div variants={item}><ProgressAnalytics /></motion.div>
          <motion.div variants={item}><SemesterPlanner /></motion.div>
          <motion.div variants={item}><EligibilityChecker /></motion.div>
          <motion.div variants={item}><AIAssistant /></motion.div>
          <motion.div variants={item}><ActivityAndUpcoming /></motion.div>
        </div>

      </div>
    </motion.div>
  );
}

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Background3D from './components/Background3D';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading all pages to drastically improve initial load time
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const CourseCatalog = lazy(() => import('./pages/dashboard/CourseCatalog'));
const MyCourses = lazy(() => import('./pages/dashboard/MyCourses'));
const RoadmapView = lazy(() => import('./pages/dashboard/RoadmapView'));
const RecommendationsView = lazy(() => import('./pages/dashboard/RecommendationsView'));
const PlannerView = lazy(() => import('./pages/dashboard/PlannerView'));
const AnalyticsView = lazy(() => import('./pages/dashboard/AnalyticsView'));
const CareerAssistant = lazy(() => import('./pages/dashboard/CareerAssistant'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const CourseManager = lazy(() => import('./pages/dashboard/admin/CourseManager'));
const PrerequisiteManager = lazy(() => import('./pages/dashboard/admin/PrerequisiteManager'));
const AlgorithmPlaygroundView = lazy(() => import('./pages/dashboard/admin/AlgorithmPlaygroundView'));
const AdminDashboard = lazy(() => import('./pages/dashboard/admin/AdminDashboard'));
const StudentManager = lazy(() => import('./pages/dashboard/admin/StudentManager'));
const EnrollmentManager = lazy(() => import('./pages/dashboard/admin/EnrollmentManager'));
const CurriculumBuilder = lazy(() => import('./pages/dashboard/admin/CurriculumBuilder'));
const DependencyHeatmap = lazy(() => import('./pages/dashboard/admin/DependencyHeatmap'));
const SemesterCapacityManager = lazy(() => import('./pages/dashboard/admin/SemesterCapacityManager'));
const ReportsCenter = lazy(() => import('./pages/dashboard/admin/ReportsCenter'));
const ImportDataset = lazy(() => import('./pages/dashboard/admin/ImportDataset'));
const CourseDetails = lazy(() => import('./pages/dashboard/admin/CourseDetails'));
const BroadcastCenter = lazy(() => import('./pages/dashboard/admin/BroadcastCenter'));
const StudyGroups = lazy(() => import('./pages/dashboard/StudyGroups'));

// Fallback loader while downloading chunks
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      <p className="mt-4 text-sm text-teal-400 font-medium">Loading Module...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Background3D />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* Shared Routes */}
            <Route path="profile" element={<Profile />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']}><Outlet /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="catalog" element={<CourseCatalog />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="roadmap" element={<RoadmapView />} />
              <Route path="recommendations" element={<RecommendationsView />} />
              <Route path="planner" element={<PlannerView />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="assistant" element={<CareerAssistant />} />
              <Route path="study-groups" element={<StudyGroups />} />
            </Route>

            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><Outlet /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<CourseManager />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="enrollments" element={<EnrollmentManager />} />
              <Route path="prerequisites" element={<PrerequisiteManager />} />
              <Route path="curriculum" element={<CurriculumBuilder />} />
              <Route path="heatmap" element={<DependencyHeatmap />} />
              <Route path="capacity" element={<SemesterCapacityManager />} />
              <Route path="algorithms" element={<AlgorithmPlaygroundView />} />
              <Route path="reports" element={<ReportsCenter />} />
              <Route path="import" element={<ImportDataset />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              <Route path="broadcast" element={<BroadcastCenter />} />
            </Route>
          </Route>
          
          <Route path="/admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

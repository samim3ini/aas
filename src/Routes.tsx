import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load the components
const AttendanceManagement = lazy(() => import('./pages/AttendanceManagement'));
const EmployeeManagement = lazy(() => import('./pages/EmployeeManagement'));
const AttendanceAnalytics = lazy(() => import('./pages/AttendanceAnalytics'));

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<EmployeeManagement />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/analytics" element={<AttendanceAnalytics />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { AdminPage } from './pages/Admin';
import { ServiceDetail } from './pages/ServiceDetail';
import { PortfolioDetail } from './pages/PortfolioDetail';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './pages/Auth';
import { CoursesPage } from './pages/Courses';
import { CourseDetailPage } from './pages/CourseDetail';
import { CoursePlayerPage } from './pages/CoursePlayer';
import { UserDashboard } from './pages/UserDashboard';
import { CheckoutPage } from './pages/Checkout';

const App: React.FC = () => {
  return (
    <ContentProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            
            <Route path="/dashboard" element={<UserDashboard />} />
            
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/learn/:id" element={<CoursePlayerPage />} />

            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ContentProvider>
  );
};

export default App;
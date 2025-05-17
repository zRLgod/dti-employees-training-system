import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/ADMIN/DashboardPage';
import { useAuth, AuthProvider } from './context/AuthContext';
import UserPage from './pages/ADMIN/UserPage';
import TrainingPage from './pages/ADMIN/TrainingPage';
import EmployeeManagePage from './pages/ADMIN/EmployeeManagePage';
import ReportPage from './pages/ADMIN/ReportPage';
import SubmitLAPPage from './pages/ADMIN/SubmitLAPPage';
import EmployeeProgressPage from './pages/ADMIN/EmoloyeeProgressPage';
import EmployeeTrainingPage from './pages/Employee/EmployeeTrainingPage';
import EmployeeLAPPage from './pages/Employee/EmployeeLAPPage';
import { TrainingRefreshProvider } from './context/TrainingRefreshContext';
import CompletedTrainingPage from './pages/Employee/CompletedTrainingPage';
import EMPEmployeeProgressPage from './pages/Employee/EMPEmployeeProgressPage';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return null; 
  }
  return isAuthenticated ? element : <Navigate to="/" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Routes go here👇🏽 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />}/>}/>
        <Route path="/usermanage" element={<PrivateRoute element={<UserPage />}/>}/>
        <Route path="/trainingmanage" element={
          <PrivateRoute element={
            user?.user_role?.toLowerCase() === "employee" ? (
              <EmployeeTrainingPage />
            ) : (
              <TrainingPage />
            )
          }/>
        }/>
        <Route path="/employeeprogress" element={
          <PrivateRoute element={
            user?.user_role?.toLowerCase() === "employee" ? (
              <EMPEmployeeProgressPage/>
            ) : (
          <EmployeeProgressPage />
            )
          }/>
        }/>
        <Route path="/LAP" element={
          <PrivateRoute element={
            user?.user_role?.toLowerCase() === "employee" ? (
              <CompletedTrainingPage />
            ) : (
              <SubmitLAPPage />
            )
          }/>
        }/>
        <Route path="/completedTraining" element={<PrivateRoute element={<CompletedTrainingPage />} />} />
        <Route path="/employeemanage" element={<PrivateRoute element={<EmployeeManagePage />}/>}/>
        <Route path="/reports" element={<PrivateRoute element={<ReportPage />}/>}/>
        <Route path='/employeeLAP' element={<PrivateRoute element={<EmployeeLAPPage />}/>}/>
      </Routes>
    </>
  );
}

import { LapSubmissionProvider } from './context/LapSubmissionContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TrainingRefreshProvider>
          <LapSubmissionProvider>
            <Toaster position="top-right" reverseOrder={false}/>
            <AppRoutes />
          </LapSubmissionProvider>
        </TrainingRefreshProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

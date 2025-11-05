/**
 * Candidate Dashboard Page
 */
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // TODO: Replace with v0 generated dashboard UI
  // - Welcome message
  // - Resume upload status
  // - Interview status
  // - Quick actions

  return (
    <div className="min-h-screen">
      <h1>Candidate Dashboard</h1>
      <p>TODO: Replace with v0 generated dashboard UI</p>
      <p>Welcome, {user?.email}</p>
    </div>
  );
};

export default Dashboard;

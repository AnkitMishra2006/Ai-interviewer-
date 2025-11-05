/**
 * Home/Landing Page
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // TODO: Implement landing page UI with v0
  // - Hero section
  // - Features overview
  // - CTA buttons (Get Started, Login)

  return (
    <div className="min-h-screen">
      <h1>AI Recruiter Pro - Landing Page</h1>
      <p>TODO: Replace with v0 generated landing page</p>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
};

export default Home;

/**
 * Home/Landing Page
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Sparkles, Play, Bot, Eye as EyeIcon, BarChart3, Briefcase, Mic, FileText, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-800">
      {/* Hero */}
      <motion.section className="relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-600 mb-3"><Sparkles className="inline h-4 w-4 mr-1" /> The Future of Recruitment is Here</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">Transform Your Hiring with AI-Powered Interviews</h1>
            <p className="mt-5 text-lg md:text-xl text-gray-700">
              Automated screening interviews with real-time monitoring and instant comprehensive reports. Save up to 80% of your recruitment time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-full bg-white shadow">10,000+ Interviews</span>
              <span className="px-3 py-1 rounded-full bg-white shadow">95% Accuracy</span>
              <span className="px-3 py-1 rounded-full bg-white shadow">24/7 Available</span>
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-95 transition-transform duration-200 hover:scale-105"
              >
                <span className="inline-flex items-center gap-2"><Rocket className="h-5 w-5" /> Get Started Free</span>
              </button>
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold shadow hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="inline-flex items-center gap-2"><Play className="h-5 w-5" /> {user ? 'Go to Dashboard' : 'Login'}</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-600">No credit card required • Free trial</p>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-white shadow-xl ring-1 ring-black/5 flex items-center justify-center">
              <div className="p-6 text-center">
                <div className="text-2xl font-semibold mb-2">AI Interview Dashboard</div>
                <p className="text-gray-600">Live questions, real-time monitoring, instant reports</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features (8 cards) */}
      <motion.section id="features" className="max-w-7xl mx-auto px-6 py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Powerful features for modern hiring</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Bot, title: 'AI Interview Engine', desc: 'Adaptive questions based on resume and responses for deeper assessment.' },
            { Icon: EyeIcon, title: 'Real-time Monitoring', desc: 'Face detection, gaze tracking, and multi-face detection for integrity.' },
            { Icon: BarChart3, title: 'Instant Reports', desc: 'Detailed, shareable reports with scores, insights, and recommendations.' },
            { Icon: Briefcase, title: 'Recruiter Dashboard', desc: 'Filter candidates, bulk actions, and analytics in one place.' },
            { Icon: Mic, title: 'Voice Analysis', desc: 'High-accuracy speech-to-text and communication analysis.' },
            { Icon: FileText, title: 'Smart Resume Parser', desc: 'Extract skills, experience, and education automatically.' },
            { Icon: Shield, title: 'Enterprise Security', desc: 'Secure by design with RBAC and encrypted data handling.' },
            { Icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Visualize performance and hiring metrics at a glance.' },
          ].map(({ Icon, title, desc }, idx) => (
            <motion.div key={title} className="rounded-xl bg-white p-5 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * idx }}>
              <Icon className="h-8 w-8 text-blue-600 mb-3" />
              <div className="text-lg font-semibold text-gray-900">{title}</div>
              <p className="mt-2 text-sm text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section id="how-it-works" className="bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">How it works</h3>
          <ol className="grid md:grid-cols-5 gap-6 text-sm">
            {['Upload Resume', 'Schedule Interview', 'AI Conducts Interview', 'Real-time Monitoring', 'Get Report'].map((s, i) => (
              <li key={s} className="rounded-lg p-4 bg-gray-50 border border-gray-200">
                <div className="text-xs text-gray-500">Step {i + 1}</div>
                <div className="mt-1 font-semibold text-gray-900">{s}</div>
                <p className="mt-2 text-gray-600">Seamless flow from candidate onboarding to instant evaluation.</p>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['10,000+', 'Interviews Conducted'],
            ['95%', 'Accuracy Rate'],
            ['80%', 'Time Saved'],
            ['4.9/5', 'Customer Rating'],
          ].map(([num, label]) => (
            <div key={label} className="rounded-xl bg-white p-6 shadow text-center">
              <div className="text-3xl font-extrabold text-gray-900">{num}</div>
              <div className="mt-1 text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Use cases */}
      <motion.section className="bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-xl font-bold text-gray-900">For Recruiters</h4>
            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>Automate initial screening interviews</li>
              <li>Scale hiring processes without quality loss</li>
              <li>Reduce bias in early stages</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">For Candidates</h4>
            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
              <li>Practice interview skills with AI</li>
              <li>Get instant, actionable feedback</li>
              <li>Flexible scheduling and accessibility</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Pricing teaser */}
      <motion.section id="pricing" className="max-w-7xl mx-auto px-6 py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold">Start Free. Scale as You Grow.</div>
            <p className="mt-1 text-white/90">14-day free trial • No credit card required</p>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold shadow hover:bg-gray-100 transition-transform duration-200 hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section className="bg-white border-t" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-gray-900">Ready to transform your hiring?</div>
            <p className="text-gray-600">Join recruiters using AI to speed up and improve screening.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-transform duration-200 hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold transition-colors duration-200 hover:bg-gray-50"
            >
              Login
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

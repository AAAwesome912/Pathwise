import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { IdCard , Mail, Lock, Phone, MapPin, User2 } from 'lucide-react';
import Logo from '../components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [visitorInfo, setVisitorInfo] = useState({ name: '', address: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'staff':
          navigate('/staff', { replace: true });
          break;
        case 'student':
        case 'visitor':
          navigate('/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
          break;
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    let credentials;
    if (role === 'visitor') {
      if (!visitorInfo.name || !visitorInfo.address || !visitorInfo.contact) {
        toast.error('Please provide all visitor information.');
        setLoading(false);
        return;
      }
      credentials = { ...visitorInfo, role };
    } else {
      if (!email || !password) {
        toast.error('Please enter your email and password.');
        setLoading(false);
        return;
      }
      credentials = { email, password, role };
    }

    try {
      const loginResult = await login(credentials);
      if (loginResult !== true) {
        toast.error(loginResult);
      }
    } catch (error) {
      toast.error('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="w-full max-w-md px-8 py-6 space-y-4 bg-white rounded-3xl shadow-xl border border-gray-200 animate-fade-in-up">
        <div className="text-center space-y-1">
          <Logo />
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back!
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
              Select your role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User2 className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setVisitorInfo({ name: '', address: '', contact: '' });
                  setEmail('');
                  setPassword('');
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {role !== 'visitor' ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="visitorName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="visitorName"
                    name="visitorName"
                    type="text"
                    required
                    value={visitorInfo.name}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="visitorAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="visitorAddress"
                    name="visitorAddress"
                    type="text"
                    required
                    value={visitorInfo.address}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, address: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="visitorContact" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="visitorContact"
                    name="visitorContact"
                    type="tel"
                    required
                    value={visitorInfo.contact}
                    onChange={(e) => setVisitorInfo({ ...visitorInfo, contact: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all duration-300 ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

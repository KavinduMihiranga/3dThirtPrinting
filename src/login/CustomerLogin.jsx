import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, User, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Customer login attempt for email:', email);
      
      const res = await axios.post('http://localhost:5000/api/auth/customer-login', {
        email,
        password,
      });
      
      console.log('✅ Customer login response:', res.data);
        
      if (res.data.success) {
        // Save customer token and info
        localStorage.setItem('customerToken', res.data.token);
        localStorage.setItem('customerUser', JSON.stringify(res.data.user));

        console.log('🔑 Customer token saved, redirecting...');
        // Redirect to customer dashboard or home page
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Customer login failed:', error);
      
      if (error.response?.data) {
        setError(error.response.data.message || 'Invalid email or password');
      } else if (error.request) {
        setError('Cannot connect to server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail('customer@example.com');
    setPassword('customer123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Demo Credentials Button */}
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="w-full mb-6 py-2 px-4 border border-blue-300 rounded-lg text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition duration-200 flex items-center justify-center"
        >
          <Mail size={16} className="mr-2" />
          Use Demo Credentials
        </button>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-red-700 font-medium">Login Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to our platform?</span>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/customer-register" 
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Create an account
          </Link>
        </div>

        {/* Admin Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Are you an admin?{' '}
            <Link 
              to="/admin-login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
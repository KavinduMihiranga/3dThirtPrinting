import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('admin'); // 'admin' or 'customer'
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    // Try to decode token to determine user type
    try {
      // This is a simple check - you might want to add proper JWT decoding
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.role === 'customer') {
        setUserType('customer');
      } else {
        setUserType('admin');
      }
    } catch (err) {
      console.log('Could not determine user type from token, defaulting to admin');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`🔄 Password reset attempt for ${userType}`);
      
      const endpoint = userType === 'customer' 
        ? 'http://localhost:5000/api/auth/customer-reset-password'
        : 'http://localhost:5000/api/auth/reset-password';
      
      const res = await axios.post(endpoint, {
        token,
        password,
      });
      
      console.log('✅ Password reset response:', res.data);
        
      if (res.data.success) {
        setSuccess(`Password reset successfully! Redirecting to ${userType} login...`);
        
        // Redirect to appropriate login page
        setTimeout(() => {
          if (userType === 'customer') {
            navigate('/customer-login');
          } else {
            navigate('/login');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      
      if (error.response?.data) {
        setError(error.response.data.message || 'Password reset failed');
      } else if (error.request) {
        setError('Cannot connect to server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <div className="space-y-3">
            <Link 
              to="/forgot-password" 
              className="block text-blue-600 hover:text-blue-800 font-medium"
            >
              Admin Password Reset
            </Link>
            <Link 
              to="/customer-forgot-password" 
              className="block text-green-600 hover:text-green-800 font-medium"
            >
              Customer Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${userType === 'customer' ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {userType === 'customer' ? <User className="text-white" size={32} /> : <Lock className="text-white" size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {userType === 'customer' ? 'Customer Account' : 'Admin Account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-red-700 font-medium">Reset Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-green-700 font-medium">Success!</p>
              <p className="text-sm text-green-600">{success}</p>
            </div>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="Enter new password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 ${userType === 'customer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              `Reset ${userType === 'customer' ? 'Customer' : 'Admin'} Password`
            )}
          </button>
        </form>

        {/* Back to Login Links */}
        <div className="mt-6 text-center space-y-2">
          <Link 
            to={userType === 'customer' ? '/customer-login' : '/login'} 
            className="block text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Back to {userType === 'customer' ? 'Customer Login' : 'Admin Login'}
          </Link>
          {userType === 'customer' && (
            <Link 
              to="/login" 
              className="block text-gray-600 hover:text-gray-800 text-sm transition duration-200"
            >
              Admin Login
            </Link>
          )}
          {userType === 'admin' && (
            <Link 
              to="/customer-login" 
              className="block text-gray-600 hover:text-gray-800 text-sm transition duration-200"
            >
              Customer Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
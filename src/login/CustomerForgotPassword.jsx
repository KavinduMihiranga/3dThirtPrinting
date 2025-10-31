import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CustomerForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('📧 Sending customer forgot password request for:', email);
      
      const res = await axios.post('http://localhost:5000/api/auth/customer-forgot-password', {
        email,
      });
      
      console.log('✅ Customer forgot password response:', res.data);
        
      if (res.data.success) {
        if (res.data.resetLink) {
          // For testing - show the reset link
          setSuccess(`${res.data.message} Reset Link: ${res.data.resetLink}`);
        } else {
          setSuccess(res.data.message);
        }
      }
    } catch (error) {
      console.error('❌ Customer forgot password failed:', error);
      
      if (error.response?.data) {
        setError(error.response.data.message || 'Request failed');
      } else if (error.request) {
        setError('Cannot connect to server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Customer Password</h2>
          <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-red-700 font-medium">Request Failed</p>
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="Enter your customer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Request...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center">
          <Link 
            to="/customer-login" 
            className="flex items-center justify-center text-green-600 hover:text-green-800 font-medium transition duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Customer Login
          </Link>
          <p className="text-sm text-gray-600">
            Admin?{' '}
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Admin Password Reset
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerForgotPassword;
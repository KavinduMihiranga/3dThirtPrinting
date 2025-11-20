import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Copy, Shield } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function CustomerForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLink('');
    setIsLoading(true);

    try {
      console.log('📧 Sending customer forgot password request for:', email);
      
      const res = await axios.post('http://localhost:5000/api/auth/customer-forgot-password', {
        email,
      });
      
      console.log('✅ Customer forgot password response:', res.data);
        
      if (res.data.success) {
        // If reset link is returned (email service not configured)
        if (res.data.resetLink) {
          setResetLink(res.data.resetLink);
          setSuccess('Password reset link generated. Please use the link below to reset your password.');
        } else {
          setSuccess('Password reset instructions sent to your email. Please check your inbox and spam folder.');
        }
      } else {
        setError(res.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('❌ Customer forgot password failed:', error);
      
      if (error.response?.data) {
        setError(error.response.data.message || 'Request failed. Please try again.');
      } else if (error.request) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    // Temporary feedback
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }
  };

  const openResetLink = () => {
    window.open(resetLink, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <ArrowLeft 
            size={24} 
            className="text-gray-500 cursor-pointer mr-3 hover:text-gray-700 transition duration-200"
            onClick={() => navigate(-1)}
          />
          <div className="text-center flex-1">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reset Customer Password</h2>
          </div>
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Enter your customer email address and we'll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Request Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Reset Link Display (when email service is not configured) */}
        {resetLink && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-blue-500" size={18} />
              <p className="text-sm font-medium text-blue-800">Manual Reset Required</p>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Email service is not configured. Please use the link below to reset your password:
            </p>
            <div className="space-y-2">
              <button 
                onClick={openResetLink}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 text-center"
              >
                Open Reset Page
              </button>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={resetLink} 
                  readOnly 
                  className="flex-1 text-xs p-2 border border-gray-300 rounded bg-white truncate"
                  placeholder="Reset link will appear here..."
                />
                <button 
                  onClick={copyToClipboard}
                  className="copy-btn flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition duration-200 whitespace-nowrap"
                >
                  <Copy size={14} />
                  Copy Link
                </button>
              </div>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Reset Link...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4 text-center">
          <Link 
            to="/customer-auth" 
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition duration-200 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Customer Login
          </Link>
          
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/customer-signup" 
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerForgotPassword;
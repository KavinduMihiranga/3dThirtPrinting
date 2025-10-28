import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetLink('');
    setIsLoading(true);

    try {
      console.log('📧 Sending forgot password request for:', email);
      
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email,
      });
      
      console.log('✅ Forgot password response:', res.data);

      if (res.data.success) {
        setMessage(res.data.message);
        
        // If reset link is returned (for testing or when email fails)
        if (res.data.resetLink) {
          setResetLink(res.data.resetLink);
          console.log('🔗 Reset link received:', res.data.resetLink);
        }
      } else {
        setError(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      
      if (error.response?.data) {
        setError(error.response.data.message || 'Request failed');
      } else if (error.request) {
        setError('Cannot connect to server. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    alert('Reset link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex items-center mb-6">
          <ArrowLeft 
            size={24} 
            className="text-gray-500 cursor-pointer mr-3"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-green-700 font-medium">Success</p>
              <p className="text-sm text-green-600">{message}</p>
            </div>
          </div>
        )}

        {resetLink && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-2">Reset Link (Copy this):</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={resetLink} 
                readOnly 
                className="flex-1 text-xs p-2 border border-gray-300 rounded bg-white"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Email service is not configured. Use this link to reset your password.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
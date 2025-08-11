import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

// A simple modal component to handle email verification
const VerificationModal = ({ isOpen, onClose, email, onVerificationSuccess }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the verification submission
  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // ✅ Use axiosInstance instead of the direct axios call
      const response = await axiosInstance.post('/api/auth/verify-email', {
        email,
        code,
      });

      // If verification is successful
      if (response.status === 200) {
        setMessage('Email verified successfully! Redirecting to login...');
        setIsError(false);
        // Call the success callback to handle redirection or other logic
        onVerificationSuccess();
      }
    } catch (err) {
      console.error('Verification error:', err);
      setIsError(true);
      // Check for specific error messages from the backend
      setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-6">
          A 6-digit code has been sent to <span className="font-semibold">{email}</span>.
          Please enter it below to complete your registration.
        </p>
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block text-gray-700 text-sm font-bold mb-2">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 123456"
              maxLength="6"
              required
            />
          </div>
          {message && (
            <p className={`text-center text-sm mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;

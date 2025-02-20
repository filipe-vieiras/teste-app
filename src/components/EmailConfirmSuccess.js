import React from 'react';
import { Link } from 'react-router-dom';

function EmailConfirmSuccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Email Confirmed!</h1>
        <p className="text-gray-600 mb-8">Your email has been successfully verified.</p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
}

export default EmailConfirmSuccess;
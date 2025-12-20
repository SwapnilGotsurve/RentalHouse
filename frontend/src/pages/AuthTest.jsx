import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AuthTest = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Authentication Test</h1>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Test Accounts:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Tenant:</strong> test@example.com / Password123</p>
            <p><strong>Owner:</strong> john.doe@example.com / Password123</p>
            <p><strong>Admin:</strong> admin@example.com / Admin123</p>
          </div>
        </div>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-green-800">✅ Authenticated</h2>
              <div className="mt-2 text-sm text-green-700">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
                <p><strong>ID:</strong> {user._id}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                to={user.role === 'tenant' ? '/tenant' : user.role === 'owner' ? '/owner' : '/admin'}
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to {user.role} Dashboard
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-yellow-800">⚠️ Not Authenticated</h2>
              <p className="mt-2 text-sm text-yellow-700">
                Please login or register to test the authentication system.
              </p>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/login"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/"
            className="block text-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
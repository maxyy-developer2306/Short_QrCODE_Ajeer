import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Admin Login</h2>
        {error && <div className="bg-red-500 text-white p-2 mb-4 rounded text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 text-sm">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
            required 
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
            required 
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="mr-2 flex h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}
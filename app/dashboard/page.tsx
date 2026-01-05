'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    const validCredentials = (
      (email === 'admin@mrcheap.com' && password === 'admin123') ||
      (email === 'sister@mrcheap.com' && password === 'sister123')
    );
    
    if (validCredentials) {
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      alert('Invalid credentials! Try:\nadmin@mrcheap.com / admin123\nor\nsister@mrcheap.com / sister123');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">MrCheap Shop</h1>
          <p className="mt-2 text-gray-600">Dar es Salaam, Tanzania</p>
          <p className="mt-1 text-sm text-gray-500">Shop Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@mrcheap.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <p className="font-medium">Test Credentials:</p>
          <p className="mt-1 font-mono text-xs">Admin: admin@mrcheap.com / admin123</p>
          <p className="mt-1 font-mono text-xs">Sister: sister@mrcheap.com / sister123</p>
          <p className="mt-4">Phone: +255 673 674 715 </p>
        </div>
      </div>
    </div>
  );
}

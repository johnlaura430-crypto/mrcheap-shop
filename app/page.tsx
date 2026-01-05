import { LoginForm } from '@/app/components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">MrCheap Shop</h1>
          <p className="mt-2 text-gray-600">Sign in to manage your shop</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Demo Credentials:</p>
          <p className="font-mono mt-1">admin@mrcheap.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

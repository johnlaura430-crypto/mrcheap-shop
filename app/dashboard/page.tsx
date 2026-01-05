'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  LogOut,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/');
    }
  };

  // Quick stats data
  const stats = [
    { label: 'Total Products', value: '0', icon: Package, color: 'bg-blue-500' },
    { label: 'Today Sales', value: 'TZS 0', icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Customers', value: '0', icon: Users, color: 'bg-purple-500' },
    { label: 'Low Stock', value: '0 items', icon: AlertCircle, color: 'bg-red-500' },
  ];

  const quickActions = [
    { label: 'Add Product', icon: PlusCircle, href: '#', color: 'bg-blue-100 text-blue-700' },
    { label: 'New Sale', icon: ShoppingCart, href: '#', color: 'bg-green-100 text-green-700' },
    { label: 'View Stock', icon: Package, href: '#', color: 'bg-purple-100 text-purple-700' },
    { label: 'Reports', icon: BarChart3, href: '#', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MrCheap Shop Dashboard</h1>
              <p className="text-gray-600">Welcome back, Admin! 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`${action.color} p-4 rounded-lg text-left hover:opacity-90 transition-opacity`}
                onClick={() => alert(`Opening ${action.label}...`)}
              >
                <action.icon className="w-8 h-8 mb-2" />
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No sales yet</p>
              <p className="text-sm mt-2">Start making sales to see data here</p>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Low Stock Items</h2>
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>All items are in stock</p>
              <p className="text-sm mt-2">Add products and set stock levels</p>
            </div>
          </div>
        </div>

        {/* Getting Started Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🚀 Getting Started</h3>
          <ol className="list-decimal pl-5 space-y-2 text-blue-700">
            <li>Add your products using "Add Product" button</li>
            <li>Set buying and selling prices for each product</li>
            <li>Add initial stock quantities</li>
            <li>Start making sales using "New Sale"</li>
            <li>Check reports to track performance</li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          <p>MrCheap Shop • Dar es Salaam, Tanzania • +255 673 674 715</p>
          <p className="mt-1">Powered by Vercel & Supabase</p>
        </div>
      </footer>
    </div>
  );
}

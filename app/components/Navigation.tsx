'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Home, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  
 
const navItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Products', icon: Package, href: '/products-new' }, // ← CHANGE THIS!
  { label: 'POS', icon: ShoppingCart, href: '/pos' },
  { label: 'Customers', icon: Users, href: '/customers' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">MrCheap Shop</h1>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">
              Dar es Salaam, TZS
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) router.push('/');
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

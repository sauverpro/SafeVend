import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    HomeIcon,
    DevicePhoneMobileIcon as DeviceTabletIcon,
    CubeIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    UserCircleIcon,
    Cog6ToothIcon as CogIcon,
    ArrowLeftOnRectangleIcon as LogoutIcon,
    Bars3Icon as MenuIcon,
    XMarkIcon as XIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: false },
  { name: 'Devices', href: '/admin/devices', icon: DeviceTabletIcon, current: false },
  { name: 'Products', href: '/admin/products', icon: CubeIcon, current: false },
  { name: 'Transactions', href: '/admin/transactions', icon: CurrencyDollarIcon, current: false },
  { name: 'Users', href: '/admin/users', icon: UserCircleIcon, current: false },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // In a real app, check auth status
  
  // Update current navigation item based on route
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  const handleLogout = () => {
    // In a real app, handle logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 flex w-64 flex-col bg-primary-700 transition-transform duration-200 ease-in-out md:hidden z-50`}>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <span className="text-white text-xl font-bold">Admin Panel</span>
            <button
              type="button"
              className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-primary-200 hover:bg-primary-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {updatedNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-600 hover:bg-opacity-75',
                  'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={classNames(
                    item.current ? 'text-primary-300' : 'text-primary-200 group-hover:text-primary-100',
                    'mr-4 h-6 w-6 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-primary-800 p-4">
          <button
            onClick={handleLogout}
            className="group block w-full flex-shrink-0"
          >
            <div className="flex items-center">
              <div>
                <LogoutIcon className="h-6 w-6 text-primary-200 group-hover:text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Logout</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-primary-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-white text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {updatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600 hover:bg-opacity-75',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current ? 'text-primary-300' : 'text-primary-200 group-hover:text-primary-100',
                      'mr-3 h-6 w-6 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-primary-800 p-4">
            <button
              onClick={handleLogout}
              className="group block w-full flex-shrink-0"
            >
              <div className="flex items-center">
                <div>
                  <LogoutIcon className="h-6 w-6 text-primary-200 group-hover:text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Logout</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex h-16 flex-shrink-0">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                {/* Search bar could go here */}
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown could go here */}
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

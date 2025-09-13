import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Cog6ToothIcon, BellIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'VendoPro',
    currency: 'USD',
    timezone: 'UTC',
    emailNotifications: true,
    twoFactorAuth: false,
  });

  const { isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => Promise.resolve({
      siteName: 'VendoPro',
      currency: 'USD',
      timezone: 'UTC',
      emailNotifications: true,
      twoFactorAuth: false,
    }),
    onSuccess: (data) => setSettings(data)
  });

  const saveSettings = useMutation({
    mutationFn: async (newSettings) => {
      // Replace with actual API call
      return new Promise(resolve => setTimeout(() => resolve(newSettings), 1000));
    },
    onSuccess: () => toast.success('Settings saved successfully'),
    onError: (error) => toast.error(`Failed to save: ${error.message}`)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings.mutate(settings);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your application settings</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['general', 'notifications', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST/EDT)</option>
                    <option value="PST">Pacific Time (PST/PDT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saveSettings.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saveSettings.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

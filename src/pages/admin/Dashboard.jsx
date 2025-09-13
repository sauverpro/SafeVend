import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  CurrencyDollarIcon, 
  DevicePhoneMobileIcon, 
  CubeIcon, 
  ChartBarIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { deviceAPI, transactionAPI } from '../../services/api';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Fetch all devices
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceAPI.getDevices(),
    refetchInterval: REFRESH_INTERVAL,
    onError: (error) => toast.error(`Error loading devices: ${error.message}`)
  });

  // Fetch recent transactions
  const { data: transactionsData = { transactions: [] }, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => transactionAPI.getTransactions({ limit: 5 }),
    refetchInterval: REFRESH_INTERVAL,
    onError: (error) => toast.error(`Error loading transactions: ${error.message}`)
  });

  // Calculate stats from devices and transactions
  const stats = React.useMemo(() => {
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status === 'active').length;
    const inactiveDevices = totalDevices - activeDevices;
    
    // Calculate total revenue from transactions
    const totalRevenue = transactionsData.transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Count total transactions
    const totalTransactions = transactionsData.transactions.length;

    return {
      totalDevices,
      activeDevices,
      inactiveDevices,
      totalRevenue,
      totalTransactions
    };
  }, [devices, transactionsData]);

  const isLoading = isLoadingDevices || isLoadingTransactions;
  const recentTransactions = transactionsData.transactions || [];

  const handleRefresh = () => {
    // Invalidate both queries to trigger a refetch
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['devices'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions', 'recent'] })
    ]).then(() => {
      toast.success('Dashboard data refreshed');
    }).catch((error) => {
      toast.error(`Error refreshing data: ${error.message}`);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={DevicePhoneMobileIcon}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          icon={CubeIcon}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={`RWF${stats.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={ChartBarIcon}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <Link
            to="/admin/transactions"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.device?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.product?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.createdAt), 'MMM d, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component
function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

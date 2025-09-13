import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { deviceAPI } from '../../services/api';
import DeviceProductsModal from '../../components/admin/DeviceProductsModal';
import DeviceQRModal from '../../components/admin/DeviceQRModal';

function formatDate(dateString) {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function StatusBadge({ status }) {
  const statusMap = {
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Active' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ExclamationCircleIcon, label: 'Needs Attention' },
    inactive: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Inactive' }
  };

  const { bg, text, icon: Icon, label } = statusMap[status] || statusMap.inactive;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className={`h-3 w-3 mr-1 ${text}`} />
      {label}
    </span>
  );
}

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const queryClient = useQueryClient();

  const openProductsModal = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setIsProductsModalOpen(true);
  };

  const closeProductsModal = () => {
    setIsProductsModalOpen(false);
    setSelectedDeviceId(null);
  };

  const openQRModal = (device) => {
    setSelectedDevice(device);
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
    setSelectedDevice(null);
  };

  // Fetch devices
  const { 
    data: devices = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceAPI.getDevices(),
    onError: (error) => {
      toast.error(error.message || 'Failed to load devices');
    }
  });

  // Delete device mutation
  const deleteDevice = useMutation({
    mutationFn: (id) => deviceAPI.deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['devices']);
      toast.success('Device deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete device');
    }
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteDevice.mutate(id);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      device.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading devices: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your vending machines
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/devices/add"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Device
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="warning">Needs Attention</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Device
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Seen
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Sales
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <tr key={device.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <QrCodeIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{device.name}</div>
                              <div className="text-gray-500">{device.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {device.location}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <StatusBadge status={device.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(device.lastSeen)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${(device.totalSales || 0).toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openQRModal(device)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              title="Show QR Code"
                            >
                              <QrCodeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openProductsModal(device.id)}
                              className="text-gray-400 hover:text-gray-500 mr-3"
                              title="Manage Products"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <Link
                              to={`/admin/devices/${device.id}`}
                              className="text-primary-600 hover:text-primary-900 mr-3"
                            >
                              <PencilIcon className="h-5 w-5" />
                              <span className="sr-only">Edit</span>
                            </Link>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(device.id, device.name)}
                              disabled={deleteDevice.isLoading}
                            >
                              {deleteDevice.isLoading && deleteDevice.variables === device.id ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <TrashIcon className="h-5 w-5" />
                              )}
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No devices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeviceProductsModal 
        deviceId={selectedDeviceId}
        isOpen={isProductsModalOpen}
        onClose={closeProductsModal}
      />
      <DeviceQRModal 
        device={selectedDevice}
        isOpen={isQRModalOpen}
        onClose={closeQRModal}
      />
    </div>
  );
}

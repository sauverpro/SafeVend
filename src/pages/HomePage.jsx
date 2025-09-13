import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCodeIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary-700 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Safe & Private Protection
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              Access high-quality protection products through our secure vending machines.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Scan QR Code
              </button>
              <Link
                to="/admin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Find a Machine',
                description: 'Locate one of our vending machines in safe, well-lit areas.',
                icon: '🔍',
              },
              {
                name: 'Scan the QR Code',
                description: 'Use your phone to scan the QR code on the machine.',
                icon: '📱',
              },
              {
                name: 'Make Your Selection',
                description: 'Choose your preferred product and complete the payment.',
                icon: '💳',
              },
            ].map((feature, index) => (
              <div key={feature.name} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-md bg-primary-500 text-white text-xl">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <QrCodeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Scan QR Code</h3>
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Camera access is required to scan QR codes. Please allow camera permissions when prompted.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  onClick={() => setIsScannerOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

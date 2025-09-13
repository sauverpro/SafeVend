import React,{ useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function DevicePage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
// const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseUrl = import.meta.env.VITE_API_URL || 'https://safe-vend-backend.onrender.com/api';
  // Fetch device and product data
  useEffect(() => { 
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/devices/${deviceId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDeviceInfo({
          id: data.id,
          name: data.name || `Vending Machine #${data.id}`,
          location: data.location || 'Location not specified',
          status: data.status || 'Unknown',
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching device data:', err);
        setError('Failed to load device information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleConfirmPurchase = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    
    setIsProcessingPayment(true);
    try {
      // Here you would typically call your payment API
      console.log('Processing payment for:', {
        productId: selectedProduct.id,
        quantity,
        amount: selectedProduct.DeviceProduct?.price * quantity,
        phoneNumber
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On successful payment
      navigate(`/transaction/success/${selectedProduct.id}?quantity=${quantity}`);
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading device information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading device</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{deviceInfo.name}</h1>
              <p className="text-sm text-gray-500">{deviceInfo.location} • {deviceInfo.status}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <ShoppingBagIcon className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      <p className="mt-1 text-lg font-medium text-primary-600">
                          {product.DeviceProduct?.price || '0.00'} RWF
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.DeviceProduct?.quantity > 0 
                          ? `${product.DeviceProduct.quantity} in stock` 
                          : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
              <p className="mt-1 text-sm text-gray-500">This device doesn't have any products assigned yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Payment</h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
                disabled={isProcessingPayment}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Order Summary</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{selectedProduct.name} x {quantity}</span>
                    <span className="text-sm font-medium">{selectedProduct.DeviceProduct?.price * quantity} RWF</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{selectedProduct.DeviceProduct?.price * quantity} RWF</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (MTN Mobile Money)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">+250</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="780123456"
                      pattern="[0-9]{9}"
                      required
                      disabled={isProcessingPayment}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your MTN Mobile Money number to receive a payment request
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isProcessingPayment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    disabled={!phoneNumber.trim() || isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Panel */}
      {selectedProduct && (
        <div className="fixed inset-x-0 bottom-0 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedProduct.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedProduct.DeviceProduct?.quantity > 0 
                    ? `${selectedProduct.DeviceProduct.quantity} in stock` 
                    : 'Out of stock'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-700">{selectedProduct.description}</p>
              
              <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  {[...Array(Math.min(10, selectedProduct.DeviceProduct?.quantity || 0)).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmPurchase}
                  disabled={!selectedProduct.DeviceProduct?.quantity}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !selectedProduct.DeviceProduct?.quantity
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

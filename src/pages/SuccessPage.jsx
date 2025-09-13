import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

// Mock data - in a real app, this would come from an API
const mockProduct = {
  id: 1,
  name: 'Premium Protection',
  price: 3.99,
  image: 'https://images.unsplash.com/photo-1584308666744-5f30e5abfe91?w=300',
};

export default function SuccessPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [quantity, setQuantity] = useState(1);

  // In a real app, we would fetch the product details here
  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(window.location.search);
    const qty = parseInt(params.get('quantity')) || 1;
    setQuantity(qty);

    // Simulate API call to get product details
    // In a real app: fetch(`/api/products/${productId}`).then(...)
    setTimeout(() => {
      setProduct(mockProduct);
    }, 500);
  }, [productId]);

  // Countdown timer for automatic redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Redirect to home after countdown
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Thank you for your purchase!
              </h1>
              <p className="mt-4 text-lg text-gray-500">
                Your order has been processed successfully.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 object-contain"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    RWF {(product.price * quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>RWF {(product.price * quantity).toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Including any applicable taxes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Please collect your items from the vending machine.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                You will be redirected to the home page in {countdown} seconds
              </p>
              <div className="mt-6">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <HomeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Back to Home
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                    Back to Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

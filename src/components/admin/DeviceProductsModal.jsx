import React,{ Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceAPI, productAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function DeviceProductsModal({ deviceId, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [position, setPosition] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch device details including its products
  const { data: device } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceAPI.getDevice(deviceId),
    enabled: !!deviceId && isOpen
  });

  // Fetch all available products
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productAPI.getProducts(),
    enabled: isOpen
  });

  // Add/Update product in device
  const updateDeviceProduct = useMutation({
    mutationFn: ({ deviceId, productId, data }) => 
      deviceAPI.updateDeviceProduct(deviceId, productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['device', deviceId]);
      toast.success('Product updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  });

  // Remove product from device
  const removeDeviceProduct = useMutation({
    mutationFn: ({ deviceId, productId }) => 
      deviceAPI.removeDeviceProduct(deviceId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['device', deviceId]);
      toast.success('Product removed from device');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove product');
    }
  });

  const resetForm = () => {
    setCurrentProduct(null);
    setSelectedProduct(null);
    setQuantity(1);
    setPrice('');
    setPosition('');
    setIsAvailable(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setSelectedProduct(product.id);
    setQuantity(product.DeviceProduct?.quantity || 1);
    setPrice(product.DeviceProduct?.price || '');
    setPosition(product.DeviceProduct?.position || '');
    setIsAvailable(product.DeviceProduct?.isAvailable !== false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    updateDeviceProduct.mutate({
      deviceId,
      productId: selectedProduct,
      data: {
        quantity: Number(quantity),
        price: Number(price),
        position,
        isAvailable
      }
    });
  };

  const handleRemove = (productId) => {
    if (window.confirm('Are you sure you want to remove this product from the device?')) {
      removeDeviceProduct.mutate({ deviceId, productId });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setQuantity(product.DeviceProduct?.quantity || 0);
    setPrice(product.DeviceProduct?.price || '');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    resetForm();
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateDeviceProduct.mutate({
      deviceId,
      productId: editingProduct,
      data: {
        quantity: Number(quantity),
        price: Number(price),
        position: position || 'default',
        isAvailable
      }
    });
    setEditingProduct(null);
  };

  // Get products not yet assigned to the device
  const availableProducts = allProducts.filter(
    product => !device?.products?.some(p => p.id === product.id)
  );
  console.log(device);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {device?.name} - Manage Products
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-gray-500">
                    {device?.location}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Assigned Products */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Products</h4>
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Product
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Qty
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Price
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {device?.products?.length > 0 ? (
                              device.products.map((product) => (
                                <tr key={product.id} className={!product.DeviceProduct?.isAvailable ? 'opacity-60' : ''}>
                                  {editingProduct === product.id ? (
                                    <td colSpan="4" className="px-4 py-4">
                                      <form onSubmit={handleUpdateProduct} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                              <button
                                                type="button"
                                                className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                onClick={() => setQuantity(Math.max(0, Number(quantity) - 1))}
                                              >
                                                -
                                              </button>
                                              <input
                                                type="number"
                                                min="0"
                                                className="block w-full border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(0, e.target.value))}
                                                required
                                              />
                                              <button
                                                type="button"
                                                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                onClick={() => setQuantity(Number(quantity) + 1)}
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700">Price (RWF)</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                              <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="0"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                              />
                                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">RWF</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                          <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                          >
                                            Save Changes
                                          </button>
                                        </div>
                                      </form>
                                    </td>
                                  ) : (
                                    <>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {product.name}
                                        {!product.DeviceProduct?.isAvailable && (
                                          <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            Disabled
                                          </span>
                                        )}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {product.DeviceProduct?.quantity || 0}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        RWF {Number(product.DeviceProduct?.price || 0).toLocaleString()}
                                      </td>
                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button
                                          onClick={() => handleEditClick(product)}
                                          className="text-primary-600 hover:text-primary-900 mr-3"
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleRemove(product.id)}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-3 py-4 text-sm text-gray-500 text-center">
                                  No products assigned to this device
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add/Edit Product Form */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {currentProduct ? 'Edit Product' : 'Add Product'}
                      </h4>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {currentProduct ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Product
                            </label>
                            <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-300 text-sm">
                              {currentProduct.name}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                              Product
                            </label>
                            <select
                              id="product"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                              value={selectedProduct || ''}
                              onChange={(e) => setSelectedProduct(e.target.value)}
                              required
                            >
                              <option value="">Select a product</option>
                              {availableProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                              Quantity
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                onClick={() => setQuantity(prev => Math.max(0, Number(prev) - 1))}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                id="quantity"
                                min="0"
                                className="block w-full border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(0, e.target.value))}
                                required
                              />
                              <button
                                type="button"
                                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                onClick={() => setQuantity(prev => Number(prev) + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">RWF</span>
                              </div>
                              <input
                                type="number"
                                id="price"
                                min="0"
                                step="1"
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                            Position (Optional)
                          </label>
                          <input
                            type="text"
                            id="position"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="e.g., A1, B2"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            id="isAvailable"
                            name="isAvailable"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                          />
                          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                            Available for purchase
                          </label>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            disabled={!selectedProduct}
                          >
                            {currentProduct ? 'Update Product' : 'Add Product'}
                          </button>
                          {currentProduct && (
                            <button
                              type="button"
                              className="ml-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                              onClick={resetForm}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import React, { useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PrinterIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import QRCode from 'react-qr-code';

export default function DeviceQRModal({ device, isOpen, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    
    winPrint.document.write(`
      <html>
        <head>
          <title>Device QR Code - ${device?.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #000;
              padding: 20px;
              margin: 20px;
              border-radius: 10px;
            }
            .device-info {
              margin-bottom: 20px;
            }
            .device-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .device-location {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }
            .qr-code {
              margin: 20px 0;
            }
            .instructions {
              font-size: 14px;
              color: #333;
              margin-top: 20px;
              max-width: 300px;
            }
            .device-id {
              font-family: monospace;
              font-size: 12px;
              color: #888;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };

  if (!device) return null;

  // Generate the QR code URL that customers will scan
  const qrCodeUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/device/${device.deviceId || device.id}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <QrCodeIcon className="h-6 w-6 mr-2 text-primary-600" />
                    Device QR Code
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div ref={printRef} className="qr-container">
                  <div className="device-info">
                    <div className="device-name">{device.name}</div>
                    <div className="device-location">{device.location}</div>
                  </div>

                  <div className="qr-code flex justify-center">
                    <QRCode
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={qrCodeUrl}
                      viewBox={`0 0 200 200`}
                    />
                  </div>

                  <div className="instructions">
                    <p><strong>Instructions:</strong></p>
                    <p>1. Scan this QR code with your phone</p>
                    <p>2. Browse available products</p>
                    <p>3. Make your selection and payment</p>
                    <p>4. Collect your item from the machine</p>
                  </div>

                  <div className="device-id">
                    Device ID: {device.deviceId || device.id}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="text-sm text-gray-500">
                    <p><strong>QR Code URL:</strong></p>
                    <p className="font-mono text-xs break-all">{qrCodeUrl}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={handlePrint}
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Print QR Code
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

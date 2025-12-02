import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const RentPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const paymentMethods = [
    { id: 'bank', name: 'Bank Transfer', account: 'Ending in ****4242', status: 'default' },
    { id: 'card', name: 'Credit Card', account: 'Ending in ****3456', status: null },
  ];

  const paymentHistory = [
    { 
      month: 'December 2024', 
      date: 'Due: Dec 1, 2024', 
      amount: '$1,750', 
      status: 'Paid',
      paidDate: 'Paid on: Dec 1, 2024',
      icon: FaCheckCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    { 
      month: 'November 2024', 
      date: 'Due: Nov 1, 2024', 
      amount: '$1,750', 
      status: 'Paid',
      paidDate: 'Paid on: Nov 1, 2024',
      icon: FaCheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      month: 'October 2024', 
      date: 'Due: Oct 1, 2024', 
      amount: '$1,750', 
      status: 'Paid',
      paidDate: 'Paid on: Oct 1, 2024',
      icon: FaCheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rent Payments</h1>
          <p className="text-gray-600">Track and manage your rent payments</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Pay Rent Now
        </button>
      </div>

      {/* Payment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Current Rent</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">$1,750</h3>
          <p className="text-xs text-gray-500">Monthly payment</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Rent Due (1/1/25)</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">$17,500</h3>
          <p className="text-xs text-gray-500">Payment due soon</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Payment Method</p>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Bank Transfer</h3>
          <p className="text-xs text-gray-500">Primary payment method</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment History</h2>
        <div className="space-y-4">
          {paymentHistory.map((payment, index) => {
            const Icon = payment.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`${payment.bgColor} p-3 rounded-lg`}>
                    <Icon className={`${payment.iconColor} text-xl`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{payment.month}</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                    <p className="text-xs text-gray-500">{payment.paidDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">{payment.amount}</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mt-1">
                    {payment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Methods</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedMethod === method.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div>
                <p className="font-semibold text-gray-800">{method.name}</p>
                <p className="text-sm text-gray-600">{method.account}</p>
              </div>
              <div className="flex items-center gap-3">
                {method.status === 'default' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  Use This
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentPayment;

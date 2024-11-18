"use client";

import { useState } from 'react'
import ClientLayout from '../components/clientLayout';
import Link from 'next/link'

export default function SettingsPage() {
  // Mock data - replace with actual data fetching in a real application
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    accountCreated: '2023-01-15',
    accountType: 'free',
    companyName: 'Acme Inc',
    shortLink: 'acme.short.link'
  })

  const [logo, setLogo] = useState(null)

  const handleLogoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0])
    }
  }

  return (
    <ClientLayout>    
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1> */}

        {/* Billing Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
          <p className="text-sm text-gray-600">
            Current Plan: <span className="font-semibold">{user.accountType === 'free' ? 'Free' : 'Paid'}</span>
          </p>
          <Link 
            href="https://billing.stripe.com/p/login/test_28o29m75B2Xf3GE288" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
          >
            Manage Subscription
          </Link>
        </section>

        {/* User Settings Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">User Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <p className="mt-1 text-sm text-gray-600">{user.accountCreated}</p>
            </div>
          </div>
        </section>

        {/* Whitelabel Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Whitelabel Settings</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={user.companyName}
                onChange={(e) => setUser({...user, companyName: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="shortLink" className="block text-sm font-medium text-gray-700">Short Link</label>
              <input
                type="text"
                id="shortLink"
                name="shortLink"
                value={user.shortLink}
                onChange={(e) => setUser({...user, shortLink: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="mt-1 block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
    </ClientLayout>
  )
}
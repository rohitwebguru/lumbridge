'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrimaryButton } from '../components/button'
import { signIn } from "next-auth/react";

export default function LoginForm() {

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden relative ">

      {/* Animated gradient background */}
      <div className="noise-bg"></div>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-2 px-4 text-center z-50">
        <div className="flex items-center justify-center">
          <span role="img" aria-label="clock" className="text-2xl mr-2">🎉</span>
          <p className="text-sm font-medium">Lumbridge has connected over 12,000+ marketing assets! </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <img
            src="/Lumbridge-logo.svg"
            alt="Lumbridge-logo"
            width="200"
            height="auto"
            className="mx-auto"
          />
        </div>

        <div className="mt-4 bg-white p-4 shadow sm:rounded-lg z-10 relative">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Login to Lumbridge</h2>
          {/* <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form> */}

          <div className="mt-6">
            <div className="relative">
              {/* <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div> */}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                {/* <Link
                  href="#" onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                > */}
                <Link
                  href="#" onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </Link>
              </div>

              <div>
                <Link
                  href="#" onClick={() => signIn('facebook', { callbackUrl: '/' })}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Don't have an account? Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrimaryButton } from '../components/button'
import { signIn } from "next-auth/react";


export default function SignupForm() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [googletoken, setgoogletoken] = useState(null)

  const handleEmailSubmit = (e) => { // Removed TypeScript type annotation
    e.preventDefault()
    if (email) setStep(2)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden relative ">

      {/* Animated gradient background */}
      <div className="noise-bg"></div>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-2 px-4 text-center z-50">
        <div className="flex items-center justify-center">
          <span role="img" aria-label="clock" className="text-2xl mr-2">⏰</span>
          <p className="text-sm font-medium">Signing up to Lumbridge takes less than 30 seconds!</p>
         
        </div>
      </div>

          <img
            src="/Lumbridge-logo.svg"
            alt="Lumbridge-logo"
            width="200"
            height="auto"
            className="mx-auto"
          />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-gray-200 p-4 shadow sm:rounded-lg">
          <div className="mb-6 text-xl font-semibold text-gray-800 text-center mb-2">
            {step === 1 && "Sign up to Lumbridge"}
            {step === 2 && "Great, almost done..."}
            {step === 3 && "Start getting access, hassle-free"}
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
              <div 
                className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ height: `${((step - 1) / 2.5) * 100}%` }}
              ></div>
            </div>

            {/* Step 1: Email Input */}
            <div className="flex items-start relative">
              <div className="flex-shrink-0 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > 1 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '1'}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Your email</h3>
                {step === 1 ? (
                  <form onSubmit={handleEmailSubmit} className="mt-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Continue
                    </button>
                  </form>
                ) : (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {email}
                    {step > 1 && (
                      <svg className="ml-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Social Sign-up */}
            <div className="flex items-start relative">
              <div className="flex-shrink-0 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > 2 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '2'}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Sign up with Facebook or Google</h3>
                {step >= 2 && (
                  <div className="mt-2 space-y-3">
                    <button
                      onClick={() => signIn('facebook', { callbackUrl: '/' })}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign up with Facebook</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">Sign up with Facebook</span>
                    </button>
                    <button
                      onClick={() => signIn("google", { callbackUrl: '/' })}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign up with Google</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm-.01 14.986c-2.753 0-4.986-2.233-4.986-4.986 0-2.753 2.233-4.986 4.986-4.986 1.34 0 2.471.495 3.339 1.307l-1.353 1.353c-.37-.356-.996-.77-1.986-.77-1.703 0-3.089 1.412-3.089 3.096 0 1.684 1.386 3.096 3.089 3.096 1.97 0 2.707-1.415 2.819-2.147h-2.819v-1.783h4.702c.044.251.071.512.071.784 0 2.847-1.905 4.876-4.773 4.876z" />
                      </svg>
                      <span className="ml-2">Sign up with Google</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Start getting access */}
            <div className="flex items-start relative">
              <div className="flex-shrink-0 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  3
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Start getting access for free</h3>
                {step === 3 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Over 10k agencies have used Leadsie to get access to +160k assets
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
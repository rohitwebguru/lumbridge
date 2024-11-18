import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import stripe from 'stripe';
export default function SubscriptionModal({ isOpen, onClose }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setplans] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    var api = async () => {
      const response = await fetch('/api/stripe', {
        method: 'GET',

      });
      var data = await response.json();
      setplans(data);
      console.log('dfgds', data.plans)
    }
    api();
  }, []);
  console.log('dfg', plans)
  const features = [
    {
      // name: 'Free',
      // price: 0,
      // description: 'For freelancers',
      // cta: 'Start for Free',
      features: [
        '1 connection per month',
        'Facebook',
        'Google',
        'Basic support',
      ],
    },
    {
      // name: 'Bronze',
      // price: 25,
      // description: 'For growing agencies',
      // cta: 'Upgrade',
      features: [
        '5 connection per month',
        'Facebook',
        'Google',
        'Basic support',
      ],
    },
    {
      // name: 'Silver',
      // price: 49,
      // description: 'For large agencies',
      // recommended: true,
      // cta: 'Upgrade',
      features: [
        '25 connection per month',
        'Facebook',
        'Google',
        'Premium support',
      ],
    },
    {
      // name: 'Rune',
      // price: 139,
      // description: 'For international agencies',
      // cta: 'Upgrade',
      features: [
        'Unlimited connections per month',
        'Facebook',
        'Google',
        'Premium support',
      ],
    },
  ]
 
  const handleCheckout = async (priceId) => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      console.log(data.url);
     
      if(data){
        window.open(data.url, '_blank');
      }
    
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all z-50">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-bold text-blue-600"
                  >
                    Choose your plan
                  </Dialog.Title>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      className={`px-4 py-2 rounded-lg ${!isAnnual ? 'bg-white text-blue-600' : 'text-gray-600'
                        } transition-all duration-300`}
                      onClick={() => setIsAnnual(false)}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${isAnnual ? 'bg-white text-blue-600' : 'text-gray-600'
                        } transition-all duration-300`}
                      onClick={() => setIsAnnual(true)}
                    >
                      Annually
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Select a plan that best fits your needs. You can choose between monthly and annual billing options.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.plans?.map((plan, index) => {
                    const isYearlyPlan = plan.recurring?.interval === 'year';
                    const isMonthlyPlan = plan.recurring?.interval === 'month';

                    if (plan.unit_amount / 100 === 399) {
                      return null;
                    }
                    if (plan.unit_amount === 0 || (isAnnual && isYearlyPlan) || (!isAnnual && isMonthlyPlan)) {
                      return (
                        <div key={index} className={`bg-gray-50 rounded-md p-4 flex flex-col ${plan.product.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-blue-600">{plan.product.name}</h3>
                          </div>

                          {plan.product.recommended && (
                            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
                              Recommended
                            </span>
                          )}

                          <div className="text-3xl font-bold mb-2 text-gray-900">
                            {plan.unit_amount == 0
                              ? '0'
                              : `$${isAnnual ? plan.unit_amount / 100 : plan.unit_amount / 100}`}
                            <span className="text-sm font-normal">
                              {isAnnual ? '/year' : '/month'}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4">{plan.product.description}</p>

                          {/* <button
                            className={`${plan.product.recommended ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'} rounded-lg py-2 px-4 mb-4 hover:bg-blue-700 hover:text-white transition-colors duration-300`}
                          >
                            Upgrade
                          </button> */}

                          <button
                            className={`${plan.product.recommended
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border border-blue-600'
                              } rounded-lg py-2 px-4 mb-4 hover:bg-blue-700 hover:text-white transition-colors duration-300`}
                            disabled={loading}
                            onClick={() => handleCheckout(plan.id)} // Attach plan's price ID here
                          >
                            {loading ? 'Processing...' : 'Upgrade'}
                          </button>

                          <h4 className="font-semibold text-gray-900 mb-2">Feature Highlights:</h4>
                          <ul className="mb-4">
                            {features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center text-gray-900 text-md mb-2">
                                <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature.features}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}

                </div>
                <div className="flex mt-4 justify-end">
                  <button
                    className="bg-gray-200 text-gray-800 rounded-md py-2 px-4 hover:bg-gray-300 transition-colors duration-300"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
import { useState, useEffect } from 'react'

const SubscriptionStatus = ({ 
  usedConnections = 0, 
  totalConnections = 1, 
  tier = 'Free Trial', 
  onUpgrade = () => {} }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const progressPercentage = (usedConnections / totalConnections) * 100

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Free Trial': return 'bg-blue-500'
      case 'Silver': return 'bg-gray-400'
      case 'Gold': return 'bg-yellow-500'
      case 'Platinum': return 'bg-purple-600'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="m-4 p-2 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium text-gray-900">Connections</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTierColor(tier)}`}>
          {tier}
        </div>
      </div>
      <div className="mb-3 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center text-sm mb-2 text-gray-500">
        <span>{usedConnections} used</span>
        <span>{totalConnections - usedConnections} remaining</span>
      </div>
      <button 
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-200 flex items-center justify-center"
        onClick={onUpgrade}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Upgrade Plan
      </button>
    </div>
  )
}

export default SubscriptionStatus
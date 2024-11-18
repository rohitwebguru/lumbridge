import React from 'react';

const QuickTips = () => {
  return (
    <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            💡
          </div>
          <div>
            <h2 className="text-xl font-medium mb-1 text-gray-800">Quick Tips</h2>
            <p className="text-sm text-gray-600">Maximize your efficiency with these helpful hints</p>
          </div>
        </div>
      </div>
      <ul className="list-disc list-inside space-y-2 text-blue-700 mt-6">
        <li>Share your workspace link with clients to streamline access sharing</li>
        <li>Connect all your agency platforms to maximize efficiency</li>
        <li>Check the activity feed regularly to stay updated on client actions</li>
      </ul>
    </div>
  );
};

export default QuickTips;
import React from 'react';

const DashboardContent = ({ activeTab }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
      <p>Your dashboard content goes here. This area will expand to fill the available space and is scrollable.</p>
      <p className="mt-4">Active tab: {activeTab}</p>
      
      {/* More content to demonstrate scrolling */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <h4 className="font-medium">Activity {index + 1}</h4>
            <p className="text-gray-600 mt-2">This is a description of the activity. It provides details about what happened and when.</p>
            <p className="text-sm text-gray-500 mt-2">{index + 1} hour{index !== 0 ? 's' : ''} ago</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <h4 className="font-medium">Statistic {index + 1}</h4>
            <p className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 1000)}</p>
            <p className="text-sm text-gray-500 mt-2">Description of what this statistic represents</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
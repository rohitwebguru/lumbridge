import React from 'react';
import { PlatformLogos } from './platformLogos';

const RecentActivity = ({ activities, platforms }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <h2 className="text-xl font-medium mb-1 text-gray-800">Recent Activity</h2>
            <p className="text-sm text-gray-600">Track your clients' recent platform access shares</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          View
        </button>
      </div>
      <ul className="space-y-4 mt-6">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {activity.client.charAt(0)}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-800">{activity.client} shared access to:</p>
              <div className="flex items-center space-x-2 mt-2">
                {activity.platforms.map((platform) => {
                  const LogoComponent = PlatformLogos[platform];
                  return (
                    <div key={platform} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      {LogoComponent && <LogoComponent />}
                      <span className="text-xs text-gray-600">{platform}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-xs text-gray-500">{activity.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
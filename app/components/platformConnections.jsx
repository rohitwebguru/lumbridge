import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { PlatformLogos } from './platformLogos';
import { signIn } from "next-auth/react";
import { useSession  } from "next-auth/react";
const PlatformConnections = ({ platforms, connectedPlatforms }) => {
  const progress = (connectedPlatforms / platforms.length) * 100;

  const { data: session } = useSession();

  console.log(session)
  
  const getDataAssets = (platformName) => {
    switch (platformName) {
      case 'Facebook':
        return ['Pixel', 'Ad Account', 'Instagram Page', 'Facebook Page', 'Catalogue'];
      case 'Google':
        return ['Ad Account', 'Conversion Tracking'];
      case 'Shopify':
        return ['Store', 'Products', 'Orders'];
      default:
        return [];
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            🔌
          </div>
          <div>
            <h2 className="text-xl font-medium mb-1 text-gray-800">Platform Connections</h2>
            <p className="text-sm text-gray-600">Connect your agency accounts to streamline onboarding</p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Connection Progress</span>
          <span className="text-sm font-medium text-gray-700">{progress.toFixed(0)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="space-y-4">
        {platforms.map((platform, index) => {
          const Logo = PlatformLogos[platform.name];
          return (
            <div key={platform.name} className="p-4 bg-gray-50 text-gray-800 text-md rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {Logo && <Logo />}
                  <span className="font-medium">{platform.name}</span>
                </div>
                <div className="flex items-center">
                  {(() => {
                    if (index < connectedPlatforms) {
                      return <span className="text-green-600 font-medium">Connected</span>;
                    } else {
                      if (platform.name === 'Facebook') {
                        return (
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={() => signIn('facebook')}>
                            Connect
                          </button>
                        );
                      } else if (platform.name === 'Google') {
                        return (
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={() => signIn('google')}>
                            Connect
                          </button>
                        );
                      }else{
                        return(
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Connect
                          </button>
                        )
                      }
                    }
                  })()}
                </div>
              </div>
              <div className="mt-2 pl-11">
                <p className="text-sm text-gray-600">
                  Data assets: <span className="text-gray-500">{getDataAssets(platform.name).join(', ')}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-left">
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-blue-600 hover:underline text-sm"
        >
          <PlusCircle size={16} />
          <span>Recommend a platform</span>
        </a>
      </div>
    </div>
  );
};

export default PlatformConnections;
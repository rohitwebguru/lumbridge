import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import SubscriptionModal from './subscriptionModal';

const ClientLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 pt-36">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSubscriptionModalOpen={() => setIsSubscriptionModalOpen(true)} // Pass the function to open the modal
        />
        <main className="flex-1 ml-64 relative z-20">
          <div className="bg-gray-50 rounded-tl-3xl shadow-sm border border-gray-200 fixed top-16 right-0 bottom-0 left-64 z-40 overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="p-8 space-y-8">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
      {isSubscriptionModalOpen && <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />}
    </div>
  );
};

export default ClientLayout;
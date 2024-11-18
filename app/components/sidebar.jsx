import React, { useState } from 'react';
import { Home, Zap, ChevronUp, ChevronDown, Cog, HelpingHand } from 'lucide-react';
import Link from 'next/link';
import SubscriptionStatus from './subscriptionStatus';
import { useSession, signOut } from "next-auth/react";

const Sidebar = ({ activeTab, setActiveTab, onSubscriptionModalOpen }) => { // Ensure prop name matches
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const { data: session } = useSession();

  const sidebarItems = [
    { name: 'Home', href: '/', icon: Home, current: true },
    { name: 'Connections', href: '/connections', icon: Zap, current: false },
    { name: 'Activity', href: '/activity', icon: Home, count: '5', current: false },
    { name: 'Settings', href: '/settings', icon: Cog, current: false },
    { name: 'Support', href: '/Support', icon: HelpingHand, current: false },
  ];

  return (
    <aside className="w-64 bg-gray-50 fixed left-0 top-36 bottom-0 z-30 flex flex-col">
      <nav className="flex-1 mt-4 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out
                  ${activeTab === item.name 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab(item.name)}
              >
                <item.icon className="mr-3" size={20} />
                <span className={activeTab === item.name ? 'font-medium' : ''}>{item.name}</span>
                {item.count && (
                  <span
                    className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-800 ring-1 ring-inset ring-gray-200"
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <SubscriptionStatus onUpgrade={onSubscriptionModalOpen} /> {/* Ensure this is correct */}
      {/* Workspace Combobox */}
      <div className="p-4 relative">
        {isWorkspaceOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              <div className="text-sm font-medium">Switch Workspace</div>
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              <div className="text-sm font-medium">Create New Workspace</div>
            </div>
            {
              session ? (
                <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={()=>signOut({ callbackUrl: '/login'  })}>
                  <div className="text-sm font-medium">Logout</div>
                </div>
              ) : null
            }
          </div>
        )}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium text-sm text-gray-900">Current Workspace</div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </div>
          </div>
          {isWorkspaceOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
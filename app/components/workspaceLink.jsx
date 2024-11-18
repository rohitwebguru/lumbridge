import React, { useState } from 'react';
import { Clipboard, Cog, CogIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { PrimaryButton, SecondaryButton } from './button';
import { useSession } from 'next-auth/react';


const WorkspaceLink = ({ workspaceLinkAccess, workspaceLinkView, openDialog }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(workspaceLink);
    toast.success('Link copied to clipboard!');
  };
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            🔗
          </div>
          <div className="flex-grow flex items-center">
            <div>
              <h2 className="text-xl font-medium mb-1 text-gray-800">Your Workspace Link</h2>
              <p className="text-sm text-gray-600">Share this link with your clients for instant access</p>
            </div>
          </div>
        </div>
        <div className="items-center justify-end">
        <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg text-md ${
                !isView ? 'bg-white text-blue-600' : 'text-gray-600 '
              } transition-all duration-300`}
              onClick={() => setIsView(false)}
            >
              Manage Access
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-md ${
                isView ? 'bg-white text-blue-600' : 'text-gray-600'
              } transition-all duration-300`}
              onClick={() => setIsView(true)}
            >
              View Access
            </button>
          </div>
          <div className="px-4 py-2"></div>
        </div>
      </div>
    {isView ? ( // Conditional rendering based on isView
    //TODO -- change modal to make it view or access. currently only for access
    <div className="flex items-center space-x-2 mt-6">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={workspaceLinkView}
            readOnly 
            onClick={copyToClipboard}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-gray-800 text-sm cursor-pointer pr-24"
          />
          <a 
            href={workspaceLinkView} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 px-2 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
          >
            <ExternalLink size={14} />
          </a>
        </div>
          <PrimaryButton
          onClick={copyToClipboard}
          icon={Clipboard}
          >
          Copy
          </PrimaryButton>
  
          <SecondaryButton
            onClick={openDialog}
            icon={Cog}
          >
            Edit
          </SecondaryButton>
      </div>
      ) : (
        <div className="flex items-center space-x-2 mt-6">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={workspaceLinkAccess}
            readOnly 
            onClick={copyToClipboard}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-gray-800 text-sm cursor-pointer pr-24"
          />
          <a 
            href={workspaceLinkAccess} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 px-2 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
          >
            <ExternalLink size={14} />
          </a>
        </div>
          <PrimaryButton
          onClick={copyToClipboard}
          icon={Clipboard}
          >
          Copy
          </PrimaryButton>
  
          <SecondaryButton
            onClick={openDialog}
            icon={Cog}
          >
            Edit
          </SecondaryButton>
      </div>
      )}
    </div>
  );
};

export default WorkspaceLink;
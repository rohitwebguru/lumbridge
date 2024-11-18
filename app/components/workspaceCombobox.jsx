import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const WorkspaceCombobox = () => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  return (
    <div className="p-4 relative">
      {isWorkspaceOpen && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 hover:bg-gray-100 cursor-pointer">
            <div className="text-sm font-medium">Switch Workspace</div>
          </div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">
            <div className="text-sm font-medium">Create New Workspace</div>
          </div>
        </div>
      )}
      <div 
        className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
          <div>
            <div className="font-medium text-sm">Current Workspace</div>
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
  );
};

export default WorkspaceCombobox;
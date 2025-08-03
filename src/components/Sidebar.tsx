import React from 'react';

interface SidebarProps {
  activeFunction: string;
  onFunctionChange: (func: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFunction, onFunctionChange }) => {
  const functions = [
    {
      id: 'object-detection',
      name: 'Object Detection',
      icon: '🎯',
      description: 'Zero-shot detection with natural language'
    },
    {
      id: 'coming-soon',
      name: 'More Features',
      icon: '✨',
      description: 'Additional AI capabilities'
    }
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-purple-600 font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Platform</h1>
            <p className="text-gray-500 text-xs">Object Detection</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {functions.map((func) => (
            <button
              key={func.id}
              onClick={() => onFunctionChange(func.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                activeFunction === func.id
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-start">
                <span className="text-lg mr-3">{func.icon}</span>
                <div>
                  <div className="font-medium text-sm">{func.name}</div>
                  <div className="text-xs opacity-75 mt-1">{func.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-green-600 text-xs">●</span>
            </div>
            <div>
              <div className="font-medium text-xs">System Active</div>
              <div className="text-xs opacity-75">Ready for detection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

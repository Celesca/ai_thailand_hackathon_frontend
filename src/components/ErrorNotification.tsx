import React from 'react';

interface ErrorNotificationProps {
  error: string | null;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ error, onClose }) => {
  if (!error) return null;

  const isCorsError = error.toLowerCase().includes('cors') || 
                     error.toLowerCase().includes('network error') ||
                     error.toLowerCase().includes('failed to fetch');

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-fade-in">
      <div className={`rounded-lg p-4 shadow-lg border-l-4 ${
        isCorsError 
          ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
          : 'bg-red-50 border-red-400 text-red-800'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isCorsError ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">
              {isCorsError ? 'Connection Issue' : 'Error'}
            </h3>
            <div className="mt-1 text-sm">
              <p>{error}</p>
              {isCorsError && (
                <div className="mt-2 text-xs">
                  <p className="font-medium">Possible solutions:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Refresh the page and try again</li>
                    <li>Check your internet connection</li>
                    <li>Contact support if the issue persists</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;

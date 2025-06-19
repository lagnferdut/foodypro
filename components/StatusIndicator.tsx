import React from 'react';

interface FooterProps {
  statusMessage: string;
  appVersion: string;
}

export const Footer: React.FC<FooterProps> = ({ statusMessage, appVersion }) => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-3 shadow-t-lg z-50 mt-auto"> {/* Added mt-auto to push to bottom if content is short */}
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
        <p className="font-medium mb-1 sm:mb-0">
          Foody Pro <span className="text-green-400">v{appVersion}</span>
        </p>
        <p className="text-center sm:text-right">{statusMessage}</p>
      </div>
    </footer>
  );
};
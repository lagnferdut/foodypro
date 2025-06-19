
import React from 'react';

interface OptionGroupProps {
  title: string;
  children: React.ReactNode;
}

export const OptionGroup: React.FC<OptionGroupProps> = ({ title, children }) => {
  return (
    <div className="py-4 border-b border-gray-700 last:border-b-0">
      <h3 className="text-md font-medium text-teal-400 mb-3">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

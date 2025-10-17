import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-gray-400 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
};
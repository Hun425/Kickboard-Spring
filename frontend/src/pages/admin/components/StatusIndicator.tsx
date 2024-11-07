import React from 'react';
import { StatusItem } from './../../../types/index';

interface Props {
  isLoading: boolean;
  statusItems: StatusItem[];
}

const StatusIndicator: React.FC<Props> = ({ isLoading, statusItems }) => (
  <div className="bg-white rounded-lg shadow mb-4">
    <div className="flex justify-end p-2 gap-4">
      {isLoading ? (
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded h-6 w-24" />
          ))}
        </div>
      ) : (
        statusItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
            <span>{item.label} {item.count}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default StatusIndicator;
import React from 'react';
import { StatusItem } from './../../../types/index';

interface Props {
  isLoading: boolean;
  statusItems: StatusItem[];
}

const StatusIndicator: React.FC<Props> = ({ isLoading, statusItems }) => (
  <div className="mb-4 rounded-lg bg-white shadow">
    <div className="flex justify-end gap-4 p-2">
      {isLoading ? (
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-24 animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
      ) : (
        statusItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full bg-${item.color}-500`}></div>
            <span>
              {item.label} {item.count}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default StatusIndicator;

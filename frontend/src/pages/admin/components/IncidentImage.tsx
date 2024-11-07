import React from 'react';
import { Skeleton } from './Skeleton';

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
}

const IncidentImage: React.FC<Props> = ({ imageUrl, isLoading }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      {isLoading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Incident"
          className="w-full h-[400px] object-cover"
        />
      ) : (
        <div className="w-full h-[200px] flex items-center justify-center text-gray-500 bg-gray-100">
          이미지가 없습니다
        </div>
      )}
    </div>
  );
};

export default IncidentImage;
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
        <Skeleton className="h-[400px] w-full" />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Incident"
          className="h-[400px] w-full object-cover"
        />
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center bg-gray-100 text-gray-500">
          이미지가 없습니다
        </div>
      )}
    </div>
  );
};

export default IncidentImage;

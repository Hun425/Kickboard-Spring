import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { Report } from '../../../types/index';

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
  afterImages?: string[];
  adminStatus?: Report['adminStatus'];
}

const IncidentImage: React.FC<Props> = ({
  imageUrl,
  isLoading,
  afterImages = [],
  adminStatus,
}) => {
  const [showAfterImages, setShowAfterImages] = useState(false);

  const renderImage = (url: string, index?: number) => (
    <img
      key={index}
      src={url}
      alt={`Incident ${index !== undefined ? `After ${index + 1}` : 'Before'}`}
      className="h-[400px] w-full object-cover"
    />
  );

  const renderToggleButton = () => {
    if (adminStatus === 'COLLECT_COMPLETED' && afterImages.length > 0) {
      return (
        <button
          onClick={() => setShowAfterImages(!showAfterImages)}
          className="absolute right-2 top-2 rounded-md bg-blue-500 px-3 py-1 text-sm text-white shadow-md transition-colors hover:bg-blue-600"
        >
          {showAfterImages ? '처리 전' : '처리 후'}
        </button>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {renderToggleButton()}

      {showAfterImages ? (
        afterImages.length > 0 ? (
          <div className="grid gap-4">
            {afterImages.map((url, index) => renderImage(url, index))}
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center bg-gray-100 text-gray-500">
            처리 후 이미지가 없습니다
          </div>
        )
      ) : imageUrl ? (
        renderImage(imageUrl)
      ) : (
        <div className="flex h-[400px] items-center justify-center bg-gray-100 text-gray-500">
          이미지가 없습니다
        </div>
      )}
    </div>
  );
};

export default IncidentImage;

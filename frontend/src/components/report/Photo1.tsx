import React from 'react';

interface PhotoProps {
  images: Array<string>;
}

const Photo1: React.FC<PhotoProps> = ({ images }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center justify-center gap-4">
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {images[0] ? (
            <img
              src={images[0]}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          ) : (
            '사진'
          )}
        </div>
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {images[1] ? (
            <img
              src={images[1]}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          ) : (
            '사진'
          )}
        </div>
      </div>
    </div>
  );
};

export default Photo1;

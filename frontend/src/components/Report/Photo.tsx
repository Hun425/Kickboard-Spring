import React, { useState } from 'react';
import { useReportStore } from '../../store/ReportInfoStore';

const Photo: React.FC = () => {
  const { photos, setPhotos } = useReportStore();

  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      const imageUrl = canvas.toDataURL('image/png');
      if (!photo1) {
        setPhoto1(imageUrl);
      } else {
        setPhoto2(imageUrl);
      }

      setPhotos(imageUrl);

      stream.getTracks().forEach((track) => track.stop()); // Stop the video stream
    } catch (error) {
      console.error('Camera access denied or error:', error);
    }
  };

  const handleDelete = () => {
    setPhotos('');
    setPhotos('');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center justify-center gap-4">
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {photos.firstPhoto ? (
            <img
              src={photos.firstPhoto}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          ) : (
            '사진'
          )}
        </div>
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {photos.secondPhoto ? (
            <img
              src={photos.secondPhoto}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          ) : (
            '사진'
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleCapture}
          className="my-button w-40 rounded-lg border px-6 py-2 text-sm font-medium"
        >
          촬영
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="my-button w-40 rounded-lg border px-6 py-2 text-sm font-medium"
        >
          사진 삭제
        </button>
      </div>
    </div>
  );
};

export default Photo;

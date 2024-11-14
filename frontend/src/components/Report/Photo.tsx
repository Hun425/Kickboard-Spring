import React, { useState } from 'react';

interface PhotoProps {
  setImage1: React.Dispatch<React.SetStateAction<File | null>>;
  setImage2: React.Dispatch<React.SetStateAction<File | null>>;
}

const Photo: React.FC<PhotoProps> = ({ setImage1, setImage2 }) => {
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  photo2;

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

      // Base64 데이터를 Blob으로 변환
      const base64 = canvas.toDataURL('image/png').split(',')[1];
      const binary = atob(base64);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });

      // Blob을 파일 객체로 변환
      const file = new File([blob], 'image.png', { type: 'image/png' });

      // 첫 번째 사진과 두 번째 사진을 파일 객체로 저장
      if (!photo1) {
        setPhoto1(file);
        setImage1(file);
      } else {
        setPhoto2(file);
        setImage2(file);
      }

      // 비디오 스트림 종료
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Camera access denied or error:', error);
    }
  };

  const handleDelete = () => {
    setPhoto1(null);
    setPhoto2(null);
  };

  // 첫 번째 이미지 파일이 존재하는지 확인 후 URL 생성

  const getImageUrl = (photo: File | null) => {
    // 파일이 존재하는 경우에만 createObjectURL을 호출합니다.
    if (photo) {
      return URL.createObjectURL(photo);
    }
    return ''; // 파일이 없으면 빈 문자열을 반환
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center justify-center gap-4">
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {photo1 ? (
            <img
              src={getImageUrl(photo1)}
              alt="Captured"
              className="h-full w-full object-cover"
            />
          ) : (
            '사진'
          )}
        </div>
        <div className="my-border flex h-40 w-40 items-center justify-center border text-lg">
          {photo2 ? (
            <img
              src={getImageUrl(photo2)}
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

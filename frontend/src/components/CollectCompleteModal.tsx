// src/components/CollectCompleteModal.tsx

import { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';

export interface CollectCompleteModalProps {
  onClose: () => void;
  onSubmit: (completionImages: File | null, processType: string) => void; // Update to File | null
  address?: string | null;
  category?: string | null;
}

const CollectCompleteModal = ({
  onClose,
  onSubmit,
  address,
  category,
}: CollectCompleteModalProps) => {
  const [completionImages, setCompletionImages] = useState<File | null>(null); // Update to File type
  const [processType, setProcessType] = useState<string>('PICK');
  const [showWarning, setShowWarning] = useState(false);

  // 사진 찍기
  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompletionImages(file); // Set as File type
    }
  };

  const handleConfirm = () => {
    if (completionImages && processType !== 'PICK') {
      onSubmit(completionImages, processType); // Pass File directly
      onClose();
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75">
      <div className="relative w-80 rounded-md bg-white p-5 shadow-md">
        {/* Display Address and Category */}
        {address && category && (
          <div className="mb-4">
            <p className="font-bold">{address}</p>
            <p className="text-red-500">{category}</p>
          </div>
        )}

        {/* Photo Capture */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
            id="cameraInput"
          />
          <button
            onClick={() => document.getElementById('cameraInput')?.click()}
            className="flex items-center rounded bg-blue-500 px-4 py-2 text-white"
          >
            <CameraIcon className="h-5 w-5" />
            <p>&nbsp;사진 찍기</p>
          </button>
        </div>

        {/* Image Preview with Remove Button */}
        {completionImages && (
          <div className="relative mt-2">
            <img
              src={URL.createObjectURL(completionImages)} // Preview File
              alt="Captured preview"
              className="h-auto w-full rounded"
            />
            <button
              onClick={() => setCompletionImages(null)} // Reset File
              className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Process Type Selection */}
        <div>
          <select
            value={processType}
            onChange={(e) => {
              setProcessType(e.target.value);
              setShowWarning(false);
            }}
            className="mb-4 mt-4 w-full border p-2"
          >
            <option value="PICK">처리 유형을 고르세요</option>
            <option value="NOT_EXIST">킥보드가 신고받은 위치에 없음</option>
            <option value="MOVE">안전한 곳으로 이동시킴</option>
            <option value="TOW">견인</option>
            <option value="PARK">넘어진 걸 세워둠</option>
          </select>
        </div>

        {/* Warning Message */}
        {showWarning && (
          <p className="mb-4 text-red-500">사진과 처리 유형을 선택해주세요.</p>
        )}

        {/* Confirm and Cancel Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-300 px-4 py-2"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completionImages || processType === 'PICK'}
            className={`rounded px-4 py-2 text-white ${
              !completionImages || processType === 'PICK'
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-500'
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectCompleteModal;

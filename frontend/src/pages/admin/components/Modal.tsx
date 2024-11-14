import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '확인',
  message = '수거요청 하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
        <div className="flex flex-col items-center justify-center p-6">
          <h2 className="mb-4 text-lg font-semibold">{title}</h2>
          <p className="mb-6 text-center text-gray-600">{message}</p>
          <div className="flex w-full gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;

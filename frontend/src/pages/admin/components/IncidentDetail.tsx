import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { Report } from '../../../types/index';
import Button from './Button';
import ConfirmationModal from './Modal';

interface Props {
  report: Report | null;
  isLoading: boolean;
  onStatusChange?: (status: Report['adminStatus']) => void;
}

const IncidentDetails: React.FC<Props> = ({
  report,
  isLoading,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    Report['adminStatus'] | null
  >(null);

  const handleStatusChange = (newStatus: Report['adminStatus']) => {
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (pendingStatus && onStatusChange) {
      onStatusChange(pendingStatus);
      setIsModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-8 text-center text-gray-500">
        신고 내역을 선택해주세요
      </div>
    );
  }

  const renderActionButtons = () => {
    switch (report.adminStatus) {
      case '신고접수':
        return (
          <Button
            onClick={() => handleStatusChange('처리중')}
            className="w-20 bg-blue-500 text-white hover:bg-blue-600"
          >
            수거요청
          </Button>
        );
      case '수거중':
        return (
          <Button
            onClick={() => handleStatusChange('수거완료')}
            className="w-20 bg-blue-500 text-white hover:bg-blue-600"
          >
            수거완료
          </Button>
        );
      case '수거완료':
        return null;
      default:
        return null;
    }
  };

  const getModalMessage = () => {
    switch (pendingStatus) {
      case '처리중':
        return '해당 건에 대해 수거 요청을 하시겠습니까?';
      case '수거완료':
        return '수거가 완료되었습니까?';
      default:
        return '상태를 변경하시겠습니까?';
    }
  };

  const details = [
    { label: '현재 상태', value: report.adminStatus },
    { label: '신고 일시', value: report.createdAt },
    { label: '브랜드 정보', value: report.companyName },
    { label: '신고 구분', value: '어린이 보호구역 주차' },
    {
      label: '신고 내용',
      value: '어린이 보호구역 주차건으로 신고합니다.\n신속히 처리해주세요',
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        {details.map((item, index) => (
          <div key={index} className="border-b pb-2">
            <div className="mb-1 font-medium text-gray-600">{item.label}</div>
            {item.label === '신고 내용' ? (
              <div className="whitespace-pre-wrap">{item.value}</div>
            ) : (
              <div>{item.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">{renderActionButtons()}</div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message={getModalMessage()}
        title="상태 변경"
      />
    </div>
  );
};

export default IncidentDetails;

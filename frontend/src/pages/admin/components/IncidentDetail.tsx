import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { Report } from '../../../types/index';
import Button from './Button';
import ConfirmationModal from './Modal';
import { updateReportStatus, postReport } from '../api/adminApi';

interface Props {
  report: Report | null;
  isLoading: boolean;
  onStatusChange?: (status: Report['adminStatus']) => void;
}

const IncidentDetails: React.FC<Props> = ({
  report,
  isLoading,
  onStatusChange,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Report['adminStatus'] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: Report['adminStatus']) => {
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (pendingStatus && onStatusChange && report) {
      setIsUpdating(true);
      try {
        if (report.adminStatus === "REPORT_RECEIVED") {
          // REPORT_RECEIVED 상태에서는 먼저 postReport API 호출
          const postResponse = await postReport(report.reportId);
          if (postResponse.success) {
            // postReport 성공 후 상태 업데이트
            const statusResponse = await updateReportStatus(report.reportId, pendingStatus);
            if (statusResponse.success) {
              onStatusChange(pendingStatus);
              setIsModalOpen(false);
            }
          }
        } else {
          // 다른 상태에서는 기존 updateReportStatus API만 호출
          const response = await updateReportStatus(report.reportId, pendingStatus);
          if (response.success) {
            onStatusChange(pendingStatus);
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-gray-500">
        신고 내역을 선택해주세요
      </div>
    );
  }

  const renderActionButtons = () => {
    switch (report.adminStatus) {
      case "REPORT_RECEIVED":
        return (
          <Button
            onClick={() => handleStatusChange("COLLECT_RECEIVED")}
            className="w-24 bg-blue-500 text-white hover:bg-blue-600"
            disabled={isUpdating}
          >
            {isUpdating ? "처리중..." : "수거접수"}
          </Button>
        );
      case "COLLECT_RECEIVED":
        case "COLLECT_PROGRESS":
          case "COLLECT_COMPLETED":
        return (
          <div className='justify-between'	>

          <Button
            onClick={() => handleStatusChange("COLLECT_PROGRESS")}
            className="w-24 bg-blue-500 text-white hover:bg-blue-600"
            disabled={isUpdating}
            >
            {isUpdating ? "처리중..." : "수거시작"}
          </Button>
          <Button
            onClick={() => handleStatusChange("COLLECT_COMPLETED")}
            className="w-24 bg-blue-500 text-white hover:bg-blue-600"
            disabled={isUpdating}
            >
            {isUpdating ? "처리중..." : "수거완료"}
          </Button>
          <Button
            onClick={() => handleStatusChange("REPORT_COMPLETED")}
            className="w-24 bg-blue-500 text-white hover:bg-blue-600"
            disabled={isUpdating}
            >
            {isUpdating ? "처리중..." : "처리완료"}
          </Button>
            </div>
        );

      default:
        return null;
    }
  };

  const getModalMessage = () => {
    switch (pendingStatus) {
      case "COLLECT_RECEIVED":
        return "해당 건에 대해 수거 접수를 하시겠습니까?";
      case "COLLECT_PROGRESS":
        return "수거를 시작하시겠습니까?";
      case "COLLECT_COMPLETED":
        return "수거가 완료되었습니까?";
      case "REPORT_COMPLETED":
        return "신고 처리를 완료하시겠습니까?";
      default:
        return "상태를 변경하시겠습니까?";
    }
  };

  const getStatusLabel = (status: Report['adminStatus']) => {
    switch (status) {
      case "REPORT_RECEIVED":
        return "신고접수";
      case "COLLECT_RECEIVED":
        return "수거접수";
      case "COLLECT_PROGRESS":
        return "수거중";
      case "COLLECT_COMPLETED":
        return "수거완료";
      case "REPORT_COMPLETED":
        return "신고처리완료";
      default:
        return status;
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('ko-KR', options).replace(',', '');
  };
  
  const details = [
    { label: "현재 상태", value: getStatusLabel(report.adminStatus) },
    { label: "신고 일시", value: getFormattedDate(report.createdAt) },
    { label: "주소", value: report.address },
    { label: "브랜드 (시리얼넘버)", value: `${report.companyName} (${report.serialNumber})` },
    { label: "신고 구분", value: report.category },
    { label: "신고 내용", value: report.description },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-4">
        {details.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm font-medium text-gray-500">
              {item.label}
            </div>
            {item.label === "신고 내용" ? (
              <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm">
                {item.value}
              </div>
            ) : (
              <div className="text-sm">{item.value}</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        {renderActionButtons()}
      </div>

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

import React from 'react';
import { Report } from '../../../types/index';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Button from './Button';

interface StatusChangeModalProps {
  currentStatus: Report['adminStatus'];
  onStatusChange: (status: Report['adminStatus']) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const getStatusChangeContent = (status: Report['adminStatus']) => {
    switch (status) {
      case '신고접수':
        return {
          action: '수거요청',
          nextStatus: '처리중' as const,
          description: '해당 신고에 대해 수거요청 하시겠습니까?',
        };
      case '수거중':
        return {
          action: '수거완료',
          nextStatus: '수거완료' as const,
          description: '수거가 완료되었습니까?',
        };
      default:
        return null;
    }
  };

  const statusContent = getStatusChangeContent(currentStatus);

  if (!statusContent) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-20 bg-blue-500 text-white hover:bg-blue-600">
          {statusContent.action}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>상태 변경 확인</AlertDialogTitle>
          <AlertDialogDescription>
            {statusContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onStatusChange(statusContent.nextStatus)}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

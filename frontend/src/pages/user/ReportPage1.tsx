import React, { useEffect } from 'react';
import { useStateStore } from '../../store/StateStore';
import Address from '../../components/report/Address';
import ViolationTypeSelector from '../../components/report/ViolationTypeSelector';
import Photo from '../../components/report/Photo';
import ReportContent from '../../components/report/ReportContent';
import Serial from '../../components/report/Serial';
import Company from '../../components/report/Company';
import { Link } from 'react-router-dom';

const ReportPage1: React.FC = () => {
  const { title, setTitle, setReportList } = useStateStore();

  const response = [
    {
      reportId: 1,
      companyId: 1,
      serialNumber: '123456',
      address: '북구 1번',
      latitude: 35.2052295,
      longitude: 126.8117828,
      categoryId: 1,
      status: 'REPORT_RECEIVED',
      photos: { firstPhoto: '', secondPhoto: '' },
      description: 'test',
      createdAt: '2024-11-11 15:23:44',
      area: '북구',
    },
  ];

  useEffect(() => {
    setTitle('전동 킥보드 주정차 위반 신고');
    setReportList();
  }, [title, setTitle]);

  return (
    <>
      <Company />
      <hr className="my-4" />
      <Serial />
      <hr className="my-4" />
      <Address />
      <hr className="my-4" />
      <ViolationTypeSelector />
      <hr className="my-4" />
      <Photo />
      <hr className="my-4" />
      <ReportContent />
      <Link to="/list" className="m-6 flex items-center justify-center">
        <button
          type="button"
          className="rounded-md bg-blue-500 px-8 py-2 text-white hover:bg-blue-600"
        >
          목록으로
        </button>
      </Link>
    </>
  );
};

export default ReportPage1;

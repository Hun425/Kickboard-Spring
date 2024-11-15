import React, { useEffect, useState } from 'react';
import { useStateStore } from '../../store/StateStore';
import Address from '../../components/report/Address';
import ViolationTypeSelector from '../../components/report/ViolationTypeSelector';
import Photo from '../../components/report/Photo';
import ReportContent from '../../components/report/ReportContent';
import { useReportStore } from '../../store/ReportInfoStore';
import Serial from '../../components/report/Serial';
import Company from '../../components/report/Company';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ReportPage: React.FC = () => {
  const { title, setTitle, setReport } = useStateStore();
  const {
    companyId,
    serialNumber,
    latitude,
    longitude,
    address,
    categoryId,
    description,
    setCompanyId,
    setSerialNumber,
    reset,
  } = useReportStore();

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 위치 정보 가져오는 useEffect
  useEffect(() => {
    if (!Boolean(companyId)) {
      setCompanyId(Number(searchParams.get('companyId')) ?? 0);
    }

    if (!Boolean(serialNumber)) {
      setSerialNumber(searchParams.get('serialNumber') ?? '');
    }
  }, []);

  useEffect(() => {
    setTitle('전동 킥보드 주정차 위반 신고');
    setReport();
  }, [title, setTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const reportData = {
      companyId: companyId,
      serialNumber: serialNumber,
      latitude: latitude,
      longitude: longitude,
      address: address,
      categoryId: categoryId,
      description: description,
    };

    // JSON 데이터를 Blob으로 변환하여 첨부
    const reportBlob = new Blob([JSON.stringify(reportData)], {
      type: 'application/json',
    });

    formData.append('report', reportBlob);

    if (image1) {
      formData.append('image', image1);
    }
    if (image2) {
      formData.append('image', image2);
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + '/kickboard/reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // multipart 설정
          },
        }
      );
    } catch (error) {
      console.error('Error submitting report:', error);
    }

    reset();
    navigate('/list');
  };

  const isButtonDisabled = false;
  // !Boolean(companyId) ||
  // !Boolean(serialNumber) ||
  // !Boolean(address) ||
  // !Boolean(photos.firstPhoto);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Company />
        <hr className="my-4" />
        <Serial />
        <hr className="my-4" />
        <Address />
        <hr className="my-4" />
        <ViolationTypeSelector />
        <hr className="my-4" />
        <Photo setImage1={setImage1} setImage2={setImage2} />
        <hr className="my-4" />
        <ReportContent />
        <hr className="my-4" />
        <div className="m-6 flex items-center justify-center">
          <button
            type="submit"
            className={`rounded-md px-8 py-2 text-white ${
              isButtonDisabled
                ? 'cursor-not-allowed bg-gray-400' // 비활성화 상태에서 회색 배경과 커서 변경
                : 'bg-red-500 hover:bg-red-600' // 활성화 상태에서 빨간색 배경
            }`}
            disabled={isButtonDisabled} // 버튼 비활성화
          >
            신고하기
          </button>
        </div>
      </form>
    </>
  );
};

export default ReportPage;

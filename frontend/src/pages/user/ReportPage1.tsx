import React, { useEffect, useState } from 'react';
import { useStateStore } from '../../store/StateStore';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Company1 from '../../components/report/Company1';
import Serial1 from '../../components/report/Serial1';
import Address1 from '../../components/report/Address1';
import ViolationTypeSelector1 from '../../components/report/ViolationTypeSelector1';
import ReportContent1 from '../../components/report/ReportContent1';
import { useReportStore } from '../../store/ReportInfoStore';

interface ReportData {
  address: string;
  area: string;
  category: string;
  companyId: number;
  createdAt: string;
  descriptions: string;
  images: string[];
  latitude: number;
  longitude: number;
  reportId: number;
  serialNumber: string;
  status: string;
}

const ReportPage1: React.FC = () => {
  const { title, setTitle, setReportList } = useStateStore();
  const { setLatitude1, setLongitude1, setAddress1 } = useReportStore();
  const [responseData, setResponseData] = useState<ReportData>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URL + `/kickboard/reports/${id}`
        );
        setResponseData(response.data.data);
        setLatitude1(response.data.data.latitude);
        setLongitude1(response.data.data.longitude);
        setAddress1(response.data.data.address);
      } catch (error) {
        console.error(error);
      }
    };

    // 선언한 async 함수 호출
    fetchReports();
  }, []);

  useEffect(() => {
    setTitle('전동 킥보드 주정차 위반 신고');
    setReportList();
  }, [title, setTitle]);

  return (
    <>
      <div>{responseData?.createdAt}</div>
      <hr className="my-4" />
      <Company1 companyId={responseData?.companyId ?? 0} />
      <hr className="my-4" />
      <Serial1 serialNumber={responseData?.serialNumber ?? ''} />
      <hr className="my-4" />
      <Address1 address={responseData?.address ?? ''} />
      <hr className="my-4" />
      <ViolationTypeSelector1 category={responseData?.category ?? ''} />
      <hr className="my-4" />
      <ReportContent1 descriptions={responseData?.descriptions ?? ''} />
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

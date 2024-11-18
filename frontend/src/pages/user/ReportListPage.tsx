import React, { useEffect, useState } from 'react';
import { useStateStore } from '../../store/StateStore';
import List from '../../components/report/List';
import ListMap from '../../components/report/ListMap';
import axios from 'axios';

const ReportListPage: React.FC = () => {
  const {
    title,
    setTitle,
    setReportList,
    isReportMap,
    setIsReportMap,
    setIsReportMap1,
  } = useStateStore();

  const [responseData, setResponseData] = useState([]);
  useEffect(() => {
    setTitle('신고 목록');
    setReportList();
  }, [title, setTitle]);

  useEffect(() => {
    setIsReportMap1();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URL + '/kickboard/reports?area='
        );
        if (response) {
          setResponseData(response.data.data);
        }
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    };
    if (isReportMap) {
      fetchData();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="inline-flex cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isReportMap}
            onChange={() => {
              setIsReportMap();
            }}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full" />
          <span className="ms-3 text-gray-900">지도 보기</span>
        </label>
        {isReportMap ? (
          <ListMap response={responseData} />
        ) : (
          <List response={responseData} />
        )}
      </div>
    </>
  );
};

export default ReportListPage;

import React, { useEffect } from 'react';
import { useStateStore } from '../../store/StateStore';

const ReportListPage: React.FC = () => {
  const { title, setTitle, setReportList } = useStateStore();
  useEffect(() => {
    setTitle('신고 목록');
    setReportList();
  }, [title, setTitle]);

<<<<<<< HEAD
=======
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URL + '/kickboard/reports?area'
        );
        if (response) {
          setResponseData(response.data.data);
        }
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    };
    fetchData();
  }, []);

>>>>>>> frontend
  return (
    <>
      <div className="min-h-[calc(100vh-40px-65px)] overflow-y-auto">
        <div>신고 목록</div>
      </div>
    </>
  );
};

export default ReportListPage;

import React, { useEffect } from 'react';
import { useStateStore } from '../../store/StateStore';

const ReportPage: React.FC = () => {
  const { title, setTitle, setReport } = useStateStore();
  useEffect(() => {
    setTitle('전동 킥보드 주정차 위반 신고');
    setReport();
  }, [title, setTitle]);

  return (
    <>
      <div className="min-h-[calc(100vh-40px-65px)] overflow-y-auto">
        <div>hi</div>
      </div>
    </>
  );
};

export default ReportPage;

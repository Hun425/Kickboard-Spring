import React, { useEffect } from 'react';
import { useStateStore } from '../../store/StateStore';

const NoticePage: React.FC = () => {
  const { title, setTitle, setNotice } = useStateStore();
  useEffect(() => {
    setTitle('공지사항');
    setNotice();
  }, [title, setTitle]);

  return (
    <>
      <div className="min-h-[calc(100vh-40px-65px)] overflow-y-auto">
        <div>공지사항</div>
      </div>
    </>
  );
};

export default NoticePage;

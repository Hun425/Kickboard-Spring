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
      <div>공지사항</div>
    </>
  );
};

export default NoticePage;

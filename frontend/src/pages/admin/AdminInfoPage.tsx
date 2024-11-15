// AdminInfoPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/AdminNavBar'; // AdminNavBar 컴포넌트 임포트

interface Notice {
  id: number;
  title: string;
  content: string;
}

const AdminInfoPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // API에서 공지사항을 가져오는 함수
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/v1/kickboard/admin/notice/notices'
        );
        if (response.data.success) {
          setNotices(response.data.data.map((item: any) => item.data));
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-lg text-gray-500">로딩 중...</span>
      </div>
    );
  }

  const handleWriteNotice = () => {
    console.log('글쓰기 버튼 클릭');
    navigate('/infowrite');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar />

      <div className="ml-72 mr-72 mt-16">
        <h1 className="text-center text-2xl font-bold">공지사항</h1>
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleWriteNotice}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            글쓰기
          </button>
        </div>

        {notices.length === 0 ? (
          <div className="text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-lg border bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <h2 className="text-black-600 text-2xl font-semibold">
                  {notice.title}
                </h2>
                <p className="mt-4 whitespace-pre-line text-gray-700">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInfoPage;

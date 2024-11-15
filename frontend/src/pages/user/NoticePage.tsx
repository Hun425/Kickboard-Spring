import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Notice {
  id: number;
  title: string;
  content: string;
}

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/kickboard/admin/notice/notices`
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

  return (
    <div className="flex flex-col p-0 sm:p-4">
      <div className="space-y-4 sm:space-y-6">
        {notices.length === 0 ? (
          <div className="text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-lg border-2 border-black bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 sm:text-2xl">
                  {notice.title}
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700 sm:mt-4 sm:text-base">
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

export default NoticePage;

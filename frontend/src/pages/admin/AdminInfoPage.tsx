// 킥보드 브레이커
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
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null); // 선택된 공지사항 상태 추가
  const navigate = useNavigate();

  // API에서 공지사항을 가져오는 함수
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

  const handleWriteNotice = () => {
    console.log('글쓰기 버튼 클릭');
    navigate('/infowrite');
  };

  // 공지사항 클릭 시 모달 열기
  const handleRowClick = (notice: Notice) => {
    setSelectedNotice(notice); // 선택된 공지사항을 모달에 전달
  };

  // 모달 닫기
  const handleClosePopup = () => {
    setSelectedNotice(null); // 선택된 공지사항을 null로 설정하여 모달 닫기
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar />

      <div className="ml-72 mr-72 mt-16">
        <h1 className="text-center text-3xl font-bold">공지사항</h1>
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleWriteNotice}
            className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            글쓰기
          </button>
        </div>

        {notices.length === 0 ? (
          <div className="text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="w-3/12 border-b px-4 py-2 text-center text-white">
                  번호
                </th>
                <th className="w-9/12 border-b px-4 py-2 text-center text-white">
                  제목
                </th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => (
                <tr
                  key={notice.id}
                  className="cursor-pointer border-b hover:bg-gray-100"
                  onClick={() => handleRowClick(notice)} // 공지사항 클릭 시 모달 열기
                >
                  <td className="px-4 py-2 text-center text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-800">
                    {notice.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal (Popup) for displaying the title and content */}
      {selectedNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-auto max-h-[80%] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{selectedNotice.title}</h2>
            <p className="whitespace-pre-wrap break-words text-gray-800">
              {selectedNotice.content}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                className="rounded-lg bg-red-500 px-6 py-2 text-white transition-all hover:bg-red-600"
                onClick={handleClosePopup} // 모달 닫기
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[60px] bg-gray-100"></div>
    </div>
  );
};

export default AdminInfoPage;

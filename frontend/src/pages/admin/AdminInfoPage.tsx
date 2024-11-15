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
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-center text-white w-3/12">번호</th>
                <th className="px-4 py-2 border-b text-center text-white w-9/12">제목</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => (
                <tr
                  key={notice.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(notice)} // 공지사항 클릭 시 모달 열기
                >
                  <td className="px-4 py-2 text-center text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 text-center text-gray-800">{notice.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal (Popup) for displaying the title and content */}
      {selectedNotice && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full h-auto max-h-[80%] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedNotice.title}</h2>
            <p className="text-gray-800 whitespace-pre-wrap break-words">{selectedNotice.content}</p>
            <div className="flex justify-center mt-4">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
                onClick={handleClosePopup} // 모달 닫기
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfoPage;

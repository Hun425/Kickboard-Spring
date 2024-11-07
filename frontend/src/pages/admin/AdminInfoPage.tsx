import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './components/AdminNavBar';


interface Notice {
  userId: number;
  title: string;
  content: string;
  noticeId: number; // API에서 사용하는 noticeId
}

const AdminInfoPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/kickboard/admin/notice/notices'); // API 호출
        const data = await response.json();

        if (data.success) {
          setNotices(data.data.notices);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('백엔드 구현 후 나타날 예정');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleWriteNotice = () => {
    console.log('글쓰기 버튼 클릭');
    navigate('/infowrite'); // /infowrite로 이동
  };

  const handleViewNotice = (noticeId: number) => {
    console.log(`내용보기 버튼 클릭: 공지사항 ID ${noticeId}`);
    // 모달 또는 라우팅 로직 추가 필요
  };

  const handleEditNotice = (noticeId: number) => {
    console.log(`수정하기 버튼 클릭: 공지사항 ID ${noticeId}`);
    navigate('/infoedit');
    // 수정 로직 추가 필요
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar />
      <div className="mx-auto max-w-xl flex-1 p-4 sm:p-6 md:max-w-2xl md:p-8 lg:max-w-4xl lg:p-10 xl:max-w-5xl">
        <h2 className="mb-6 text-center text-2xl font-bold">공지사항</h2>
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleWriteNotice}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            글쓰기
          </button>
        </div>
        <div className="rounded bg-white p-4 shadow-md">
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : notices.length === 0 ? (
            <p>등록된 공지사항이 없습니다.</p>
          ) : (
            <ul>
              {notices.map((notice) => (
                <li key={notice.noticeId} className="mb-4 border-b p-4">
                  <h3 className="text-lg font-semibold">{notice.title}</h3>
                  <p className="text-gray-600">{notice.content}</p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewNotice(notice.noticeId)}
                      className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                    >
                      내용보기
                    </button>
                    <button
                      onClick={() => handleEditNotice(notice.noticeId)}
                      className="rounded bg-yellow-600 px-2 py-1 text-white hover:bg-yellow-700"
                    >
                      수정하기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInfoPage;

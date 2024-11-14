import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/AdminNavBar';

interface Notice {
  userId: number;
  title: string;
  content: string;
  noticeId: number;
}

const AdminInfoPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const url = `${import.meta.env.VITE_URL}/kickboard/admin/notice/notices`;
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // 응답 데이터 로그 출력

        if (data.success) {
          setNotices(data.data); // data.data가 공지사항 배열입니다.
        } else {
          setError(data.error?.message || '알 수 없는 오류');
        }
      } catch (err) {
        setError(
          '데이터를 가져오는 중에 문제가 발생했습니다. 다시 시도해주세요.'
        );
        console.error('API 요청 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleWriteNotice = () => {
    console.log('글쓰기 버튼 클릭');
    navigate('/infowrite');
  };

  // const handleViewNotice = (noticeId: number) => {
  //   console.log(`내용보기 버튼 클릭: 공지사항 ID ${noticeId}`);
  // };

  // const handleEditNotice = (noticeId: number) => {
  //   console.log(`수정하기 버튼 클릭: 공지사항 ID ${noticeId}`);
  //   navigate('/infoedit');
  // };

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
                    {/* <button
                      onClick={() => handleViewNotice(notice.noticeId)}
                      className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                    >
                      내용보기
                    </button> */}
                    {/* <button
                      onClick={() => handleEditNotice(notice.noticeId)}
                      className="rounded bg-yellow-600 px-2 py-1 text-white hover:bg-yellow-700"
                    >
                      수정하기
                    </button> */}
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

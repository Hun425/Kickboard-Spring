import React, { useState } from 'react';
import NavBar from './AdminNavBar';

interface Notice {
  id: number;
  title: string;
  content: string;
}

const AdminInfoPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: '킥보드 불법주차 안내',
      content:
        '최근 킥보드의 불법 주차 문제가 증가하고 있습니다. 안전한 통행을 위해 킥보드는 지정된 주차 구역에 주차해 주시기 바랍니다.',
    },
    {
      id: 2,
      title: '킥보드 불법 주차 단속 강화',
      content:
        '킥보드 불법 주차에 대한 단속이 강화됩니다. 불법 주차를 할 경우 과태료가 부과될 수 있습니다.',
    },
    {
      id: 3,
      title: '주차 규정 준수 요청',
      content:
        '모든 이용자는 킥보드를 주차할 때 반드시 규정을 준수해야 합니다. 다른 보행자에게 불편을 주지 않도록 해주세요.',
    },
    {
      id: 4,
      title: '지정 주차 구역 안내',
      content:
        '킥보드는 지정된 주차 구역에 주차해야 합니다. 해당 구역의 위치를 확인하고 사용해 주세요.',
    },
    {
      id: 5,
      title: '킥보드 주차 관련 주민 불만',
      content:
        '최근 킥보드의 불법 주차로 인해 주민들로부터 불만이 제기되고 있습니다. 적극적인 협조 부탁드립니다.',
    },
    {
      id: 6,
      title: '불법 주차 시 패널티 안내',
      content:
        '불법으로 킥보드를 주차할 경우 최대 10만 원의 과태료가 부과될 수 있습니다. 꼭 주의해 주세요.',
    },
  ]);
  // TODO : 지영 임시 수정
  setNotices
  // -----------------------
  const handleWriteNotice = () => {
    // 글쓰기 로직 추가
    console.log('글쓰기 버튼 클릭');
  };

  const handleViewNotice = (id: number) => {
    // 내용보기 로직 추가
    console.log(`내용보기 버튼 클릭: 공지사항 ID ${id}`);
  };

  const handleEditNotice = (id: number) => {
    // 수정하기 로직 추가
    console.log(`수정하기 버튼 클릭: 공지사항 ID ${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* NavBar Component */}
      <NavBar />
      <div className="mx-auto max-w-xl flex-1 p-4 sm:p-6 md:max-w-2xl md:p-8 lg:max-w-4xl lg:p-10 xl:max-w-5xl">
        <h2 className="mb-6 text-center text-2xl font-bold">공지사항</h2>
        {/* 버튼을 오른쪽 정렬하기 위해 div로 감쌈 */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleWriteNotice}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            글쓰기
          </button>
        </div>
        <div className="rounded bg-white p-4 shadow-md">
          {notices.length === 0 ? (
            <p>등록된 공지사항이 없습니다.</p>
          ) : (
            <ul>
              {notices.map((notice) => (
                <li key={notice.id} className="mb-4 border-b p-4">
                  <h3 className="text-lg font-semibold">{notice.title}</h3>
                  <p className="text-gray-600">{notice.content}</p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewNotice(notice.id)}
                      className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                    >
                      내용보기
                    </button>
                    <button
                      onClick={() => handleEditNotice(notice.id)}
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

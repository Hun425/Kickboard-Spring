import React, { useEffect, useState } from 'react';
import NavBar from './components/AdminNavBar';

const AdminIdManage: React.FC = () => {
  const [adminData, setAdminData] = useState<any[]>([]); // 여러 사용자 데이터를 배열로 관리
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 환경 변수에서 API URL 가져오기
        const apiUrl = import.meta.env.VITE_URL;

        // 1번부터 5번까지의 사용자 정보를 가져오기
        const userRequests = [];
        for (let i = 1; i <= 5; i++) {
          const endpoint = `/users/${i}`;
          const url = `${apiUrl}${endpoint}`;
          userRequests.push(fetch(url).then((response) => response.json()));
        }

        // 모든 요청을 병렬로 보내고 응답을 기다림
        const responses = await Promise.all(userRequests);

        const data = responses.map((response) => response.data).filter(Boolean); // 유효한 데이터를 필터링

        if (data.length > 0) {
          setAdminData(data); // 데이터를 상태에 저장
        } else {
          setResponseMessage('사용자 데이터를 찾을 수 없습니다.');
        }
      } catch (error) {
        setResponseMessage('서버에 연결할 수 없습니다.');
      }
    };

    fetchAdminData();
  }, []); // 컴포넌트가 마운트될 때만 실행

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar Component */}
      <NavBar />

      <div className="container mx-auto p-6">
        {/* <h2 className="text-2xl font-semibold text-gray-800">관리자 계정  </h2> */}
        <h1 className="mb-8 mt-8 text-center text-2xl font-semibold text-gray-800">
          관리자 계정
        </h1>
        {/* <h2 className="text-2xl font-semibold text-gray-800">관리자 계정  </h2> */}
        {responseMessage ? (
          <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
            <p className="font-medium">{responseMessage}</p>
          </div>
        ) : (
          adminData.length > 0 &&
          adminData.map((admin, index) => (
            <div
              key={index}
              className="mx-auto mb-6 max-w-lg overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="p-6">
                {/* <h2 className="text-2xl font-semibold text-gray-800">관리자 계정 {index + 1} </h2> */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">지역</span>
                    <span className="font-bold text-blue-600">
                      {admin.location?.field || '없음'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">
                      이메일
                    </span>
                    <span className="text-gray-800">{admin.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">역할</span>
                    <span className="text-gray-800">{admin.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminIdManage;

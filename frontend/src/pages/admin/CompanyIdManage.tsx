import React, { useEffect, useState } from 'react';
import NavBar from './components/AdminNavBar';

const CompanyIdManage: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 환경 변수에서 API URL 가져오기
        const apiUrl = import.meta.env.VITE_URL;
        const endpoint = '/users/6'; // 수거업체 계정 조회 엔드포인트

        // 요청 URL 구성
        const url = `${apiUrl}${endpoint}`;

        // API 요청 보내기
        const response = await fetch(url);
        const data = await response.json();

        // 수거업체가 존재하면 데이터 저장
        if (data.success && data.data) {
          setAdminData(data.data);
        } else {
          setResponseMessage('수거업체 계정을 생성해주세요');
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
        <h1 className="mb-8 mt-8 text-center text-2xl font-semibold text-gray-800">
          수거업체 계정
        </h1>
        {responseMessage ? (
          <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
            <p className="font-medium">{responseMessage}</p>
          </div>
        ) : (
          adminData && (
            <div className="mx-auto max-w-lg overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                {/* <h2 className="text-2xl font-semibold text-gray-800">수거업체 계정</h2> */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">지역</span>
                    <span className="font-bold text-orange-600">
                      {adminData.location?.field || '없음'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">
                      이메일
                    </span>
                    <span className="text-gray-800">{adminData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-600">역할</span>
                    <span className="text-gray-800">{adminData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CompanyIdManage;

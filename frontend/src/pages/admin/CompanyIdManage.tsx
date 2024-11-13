import React, { useState } from 'react';
import NavBar from './components/AdminNavBar';

const CompanyIdManage: React.FC = () => {
  const [formData, setFormData] = useState({
    area: '',
    email: '',
    password: '',
    role: 'collector', // 기본값을 'collector'로 고정
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 환경 변수에서 API URL 가져오기
      const apiUrl = import.meta.env.VITE_URL;
      const endpoint = '/kickboard/signup';  // API 엔드포인트

      // 요청 URL 구성
      const url = `${apiUrl}${endpoint}`;

      // KakaoMap API 키 (필요한 경우 Authorization 헤더에 사용)
      const kakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

      // API 요청 보내기
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요시 KakaoMap API 키를 Authorization 헤더에 포함
          'Authorization': `Bearer ${kakaoMapApiKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 성공적인 응답 처리
      if (data.success) {
        setResponseMessage(data.data);
      } else {
        setResponseMessage(data.error?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setResponseMessage('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar Component */}
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="mb-6 mt-8 text-center text-3xl font-bold">계정 수정</h1>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md rounded bg-white p-8 shadow-md"
        >
          {/* 역할 선택 필드 - 'collector'로 고정 */}
          <div className="mb-4">
            <label className="mb-2 block" htmlFor="role">
              역할
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded border p-2"
              disabled // role 필드를 고정된 값으로 만들기 위해 비활성화
            >
              <option value="collector">수거업체</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block" htmlFor="area">
              지역
            </label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full rounded border p-2"
            >
              <option value="" disabled>
                지역 선택
              </option>
              <option value="광산구">광산구</option>
              <option value="동구">동구</option>
              <option value="서구">서구</option>
              <option value="남구">남구</option>
              <option value="북구">북구</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block" htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="kickboard@naver.com" // 예시 이메일
              className="w-full rounded border p-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block" htmlFor="password">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="kick12345*&^" // 예시 비밀번호
              className="w-full rounded border p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-green-500 p-2 text-white transition duration-200 hover:bg-blue-600"
          >
            수정하기
          </button>
        </form>

        {responseMessage && (
          <p className="mt-4 text-center text-red-500">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyIdManage;

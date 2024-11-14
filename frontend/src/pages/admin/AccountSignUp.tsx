import React, { useState } from 'react';
import NavBar from './components/AdminNavBar';

const AccountSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    area: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [responseMessage, setResponseMessage] = useState('');

  // VITE 환경 변수에서 URL과 카카오맵 API 키 가져오기
  const apiUrl = import.meta.env.VITE_URL; // API URL
  // const kakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY; // 카카오맵 API 키

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
      // apiUrl을 사용하여 요청 경로 수정
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
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
        <h1 className="mb-6 mt-8 text-center text-3xl font-bold">계정 생성</h1>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md rounded bg-white p-8 shadow-md"
        >
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
            >
              <option value="admin">관리자</option>
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
              placeholder="exam@naver.com"
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
              placeholder="mypass12345"
              className="w-full rounded border p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600"
          >
            회원가입
          </button>
        </form>
        {responseMessage && (
          <p className="mt-4 text-center text-red-500">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AccountSignUp;

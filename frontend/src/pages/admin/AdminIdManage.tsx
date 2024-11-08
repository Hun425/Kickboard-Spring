import React, { useState } from 'react';
import NavBar from './components/AdminNavBar';

const AdminIdManage: React.FC = () => {
  const [formData, setFormData] = useState({
    area: '',
    email: '',
    password: '',
    role: 'admin', // 기본값으로 'admin' 고정
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
      const response = await fetch('/kickboard/signup', {
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
        <h1 className="mb-6 mt-8 text-center text-3xl font-bold">계정 수정</h1>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md rounded bg-white p-8 shadow-md"
        >
          {/* 역할 선택 필드 - 'admin'으로 고정 */}
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
              <option value="admin">관리자</option>
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
              placeholder="abc@naver.com" // 이메일 예시 텍스트
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
              placeholder="Gongmu@#@@12345" // 비밀번호 예시 텍스트
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

export default AdminIdManage;

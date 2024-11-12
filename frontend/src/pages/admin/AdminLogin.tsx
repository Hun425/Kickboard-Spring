import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // v6에서는 useNavigate 사용
import NavBar from './components/AdminNavBar';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // 로그인 오류 메시지를 저장할 상태 추가
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로그인 데이터
    const loginData = {
      email,
      password,
    };

    try {
      // 로그인 API 호출
      const response = await fetch('/kickboard/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 시
        if (data.success) {
          // accessToken을 로컬 스토리지에 저장
          localStorage.setItem('accessToken', data.data.accessToken);

          // 관리자 대시보드 페이지로 이동
          navigate('/adminMainPage'); // 로그인 성공 후 '/adminMainPage'로 이동
        } else {
          // 로그인 실패 시 오류 메시지 처리
          setError(data.error?.message || '로그인 실패');
        }
      } else {
        // 응답 상태가 OK가 아닐 경우
        setError(data.error?.message || '서버 오류');
      }
    } catch (error) {
      setError('네트워크 오류 발생');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* NavBar Component */}
      {/* <NavBar /> */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-96 rounded bg-white p-6 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold">관리자 페이지</h2>

          {/* 오류 메시지 출력 */}
          {error && (
            <div className="mb-4 text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

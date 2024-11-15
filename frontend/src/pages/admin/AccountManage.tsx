import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from './components/AdminNavBar';

const AccountManage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar />
      <div className="flex flex-grow flex-col items-center justify-center p-6">
        {/* <h1 className="mb-12 text-3xl font-bold text-gray-800">계정 관리</h1> */}
        <div className="w-full max-w-lg rounded-lg bg-white p-8 pt-10 shadow-md">
          <h1 className="mb-12 text-center text-3xl font-bold text-gray-800">
            계정 관리
          </h1>
          <div className="w-full max-w-xs">
            <ul className="mb-4 flex justify-center space-x-4">
              <li className="ml-28 flex flex-col items-center">
                <Link to="/companyID">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                    <img
                      src="/assets/company.png" // 수거업체 이미지 경로
                      alt="Company"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button className="w-full rounded-md bg-orange-200 p-4 shadow-sm">
                    수거업체
                  </button>
                </Link>
              </li>

              <li className="flex flex-col items-center">
                <Link to="/adminID">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                    <img
                      src="/assets/gong.png" // 관리자 이미지 경로
                      alt="Admin"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button className="w-full rounded-md bg-orange-200 p-4 shadow-sm">
                    관리자
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          <br />
          <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.0rem' }}>
            {' '}
            Q. 새로운 수거업체 계정이 필요하신가요?
          </p>
          <Link to="/accountsignup">
            <button className="mt-2 w-full rounded bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700">
              계정 생성
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountManage;

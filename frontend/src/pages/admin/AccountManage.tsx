import React from 'react';
import NavBar from './AdminNavBar';

const AccountManage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar Component */}
      <NavBar />
      <p>계정관리</p>
      {/* Main Content */}
    </div>
  );
};

export default AccountManage;

import React, { useState } from 'react';

const AdminNavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-300 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Desktop Menu */}
        <div className="ml-10 hidden space-x-8 md:flex">
          <a
            href="/adminMainPage"
            className="text-gray-700 hover:text-gray-900"
          >
            신고현황
          </a>
          <a href="/adminmap" className="text-gray-700 hover:text-gray-900">
            지도
          </a>
          <a
            href="/accountmanage"
            className="text-gray-700 hover:text-gray-900"
          >
            계정관리
          </a>
          <a href="/admininfo" className="text-gray-700 hover:text-gray-900">
            공지사항
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Logo or Title */}
        {/* font-semibold */}
        <div className="mr-10 text-xl">
          <a href="#">관리자님</a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-2 space-y-2 md:hidden">
          <a
            href="/adminMainPage"
            className="block text-gray-700 hover:text-gray-900"
          >
            신고현황
          </a>
          <a
            href="/adminmap"
            className="block text-gray-700 hover:text-gray-900"
          >
            지도
          </a>
          <a
            href="/accountmanage"
            className="block text-gray-700 hover:text-gray-900"
          >
            계정관리
          </a>
          <a
            href="/admininfo"
            className="block text-gray-700 hover:text-gray-900"
          >
            공지사항
          </a>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar;

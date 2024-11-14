import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

interface StatusItem {
  label: string;
  count: number;
  colorClass: string;
  value: string;
}

interface AdminNavBarProps {
  isLoading?: boolean;
  statusItems?: StatusItem[];
}

const AdminNavBar: React.FC<AdminNavBarProps> = ({
  isLoading = false,
  statusItems = [
    {
      label: '신고접수',
      count: 10,
      colorClass: 'bg-red-500',
      value: '신고접수',
    },
    {
      label: '수거중',
      count: 10,
      colorClass: 'bg-yellow-500',
      value: '수거중',
    },
    {
      label: '수거완료',
      count: 10,
      colorClass: 'bg-green-500',
      value: '수거완료',
    },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-200 p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* Desktop Menu - Now on the left */}
          <div className="hidden space-x-8 md:flex">
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
              계정정보
            </a>
            <a href="/admininfo" className="text-gray-700 hover:text-gray-900">
              공지사항
            </a>
          </div>

          {/* Status Indicators and Admin Text */}
          <div className="mb-4 flex items-center gap-6 md:mb-0">
            {isLoading ? (
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            ) : (
              <>
                {statusItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${item.colorClass}`}
                    ></div>
                    <span>
                      {item.label} {item.count}
                    </span>
                  </div>
                ))}
                <span className="text-xl font-semibold">관리자 님</span>
              </>
            )}
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
                  d={
                    isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-2 space-y-2 md:hidden">
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              신고현황
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              지도
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              계정관리
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              공지사항
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavBar;

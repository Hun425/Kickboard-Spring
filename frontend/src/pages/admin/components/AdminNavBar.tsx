import React, { useState, useEffect } from 'react';
import { Skeleton } from './Skeleton';
import { fetchReports } from '../api/adminApi';

interface StatusItem {
  label: string;
  count: number;
  colorClass: string;
  value: string;
  bgColor: string;
  textColor: string;
}

const AdminNavBar: React.FC<{ onDateChange?: (date: string) => void }> = ({
  onDateChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [statusCounts, setStatusCounts] = useState({
    REPORT_RECEIVED: 0,
    COLLECT_RECEIVED: 0,
    COLLECT_PROGRESS: 0,
    COLLECT_COMPLETED: 0,
    REPORT_COMPLETED: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const area = localStorage.getItem('area');

  useEffect(() => {
    const loadStatusCounts = async () => {
      try {
        const response = await fetchReports();
        if (response.success && response.data) {
          const counts = response.data.reports.reduce(
            (acc: any, report: any) => {
              acc[report.adminStatus] = (acc[report.adminStatus] || 0) + 1;
              return acc;
            },
            {}
          );
          setStatusCounts(counts);
        }
      } catch (error) {
        console.error('상태 카운트 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatusCounts();
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    onDateChange?.(e.target.value);
  };

  const statusItems: StatusItem[] = [
    {
      label: '신고접수',
      count: statusCounts['REPORT_RECEIVED'] || 0,
      colorClass: 'bg-red-500',
      value: 'REPORT_RECEIVED',
      bgColor: '#FEE2E2',
      textColor: '#DC2626',
    },
    {
      label: '수거접수',
      count: statusCounts['COLLECT_RECEIVED'] || 0,
      colorClass: 'bg-orange-500',
      value: 'COLLECT_RECEIVED',
      bgColor: '#FFEDD5',
      textColor: '#EA580C',
    },
    {
      label: '수거중',
      count: statusCounts['COLLECT_PROGRESS'] || 0,
      colorClass: 'bg-yellow-500',
      value: 'COLLECT_PROGRESS',
      bgColor: '#E0F2FE',
      textColor: '#0284C7',
    },
    {
      label: '수거완료',
      count: statusCounts['COLLECT_COMPLETED'] || 0,
      colorClass: 'bg-blue-500',
      value: 'COLLECT_COMPLETED',
      bgColor: '#DBEAFE',
      textColor: '#2563EB',
    },
    {
      label: '처리완료',
      count: statusCounts['REPORT_COMPLETED'] || 0,
      colorClass: 'bg-green-500',
      value: 'REPORT_COMPLETED',
      bgColor: '#DCFCE7',
      textColor: '#16A34A',
    },
  ];

  return (
    <nav className="bg-gray-200 p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
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
              계정관리
            </a>
            <a href="/admininfo" className="text-gray-700 hover:text-gray-900">
              공지사항
            </a>
          </div>

          <div className="mb-4 flex items-center gap-6 md:mb-0">
            {isLoading ? (
              <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
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
                <span className="text-xl font-semibold">{area} 관리자</span>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
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

        {/* 모바일 메뉴 */}
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
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full rounded-md border border-gray-300 px-3 py-1"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavBar;

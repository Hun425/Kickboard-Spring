import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

interface ReportData {
  address: string;
  area: string;
  category: string;
  companyId: number;
  createdAt: string;
  descriptions: string;
  images: string[];
  latitude: number;
  longitude: number;
  reportId: number;
  serialNumber: string;
  status: string;
}

interface ListProps {
  response: ReportData[]; // response의 타입을 실제 데이터에 맞게 정의해주세요
}

const List: React.FC<ListProps> = ({ response }) => {
  const [activeItem, setActiveItem] = useState<string>('전체');
  const [area, setArea] = useState<string>('');

  const handleClick = (item: string) => {
    setActiveItem(item);
  };

  const handleAreaClick = (selectedArea: string) => {
    setArea(selectedArea);
  };

  const areaOptions = ['전체', '북구', '서구', '동구', '남구', '광산구'];

  const commonClasses = 'rounded-lg px-4 py-2 whitespace-nowrap';

  // 상태에 따른 필터링 함수
  const filteredResponse = response.filter((item) => {
    const matchesArea = area === '전체' || item.area === area || area === '';
    const matchesStatus =
      activeItem === '전체' ||
      (activeItem === '처리중' && item.status !== 'REPORT_COMPLETED') ||
      (activeItem === '완료' && item.status === 'REPORT_COMPLETED');
    return matchesArea && matchesStatus;
  });

  const getStatus = (status: string): JSX.Element => {
    return status === 'REPORT_COMPLETED' ? (
      <div className="rounded-lg border border-green-300 bg-green-100 px-3 py-1 font-semibold text-green-700">
        처리 완료
      </div>
    ) : (
      <div className="rounded-lg border border-yellow-300 bg-yellow-100 px-3 py-1 font-semibold text-yellow-700">
        처리 중
      </div>
    );
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatDateTime1 = (dateString: string): string => {
    const date = new Date(dateString);

    // 오전/오후 판단
    const hours = date.getHours();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours;

    return `${ampm} ${displayHours}시 ${String(date.getMinutes()).padStart(2, '0')}분`;
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 지역구 선택 */}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Menu as="div" className="relative inline-block w-full text-left">
            <div className="w-full">
              <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {area || '지역구를 선택하세요'}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-400"
                />
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {areaOptions.map((areaOption) => (
                  <MenuItem key={areaOption}>
                    {({ active }) => (
                      <div
                        onClick={() => handleAreaClick(areaOption)}
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {areaOption}
                      </div>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
        {/* 처리상태 선택 */}
        <ul className="flex items-center gap-1">
          <li>
            <div
              onClick={() => handleClick('전체')}
              className={`${commonClasses} ${
                activeItem === '전체'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              전체
            </div>
          </li>
          <li>
            <div
              onClick={() => handleClick('처리중')}
              className={`${commonClasses} ${
                activeItem === '처리중'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              처리중
            </div>
          </li>
          <li>
            <div
              onClick={() => handleClick('완료')}
              className={`${commonClasses} ${
                activeItem === '완료'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              완료
            </div>
          </li>
        </ul>
        {/* 목록 부분 */}
        {response && response.length > 0 ? (
          filteredResponse.map((item) => (
            <div key={item.reportId}>
              <Link to={`${item.reportId}`}>
                <div className="rounded-lg border p-4">
                  <div className="font-bold">{item.address}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span>{formatDateTime(item.createdAt)}</span>
                      <span>{formatDateTime1(item.createdAt)}</span>
                    </div>
                    {getStatus(item.status)}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        )}
      </div>
    </>
  );
};

export default List;

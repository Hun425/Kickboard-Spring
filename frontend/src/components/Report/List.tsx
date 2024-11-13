import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

const List: React.FC = () => {
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
  const response = [
    {
      reportId: 1,
      companyId: 1,
      serialNumber: '123456',
      address: '북구 1번',
      latitude: 35.2052295,
      longitude: 126.8117828,
      categoryId: 1,
      status: 'REPORT_RECEIVED',
      photos: { firstPhoto: '', secondPhoto: '' },
      description: 'test',
      createdAt: '2024-11-11 15:23:44',
      area: '북구',
    },
    {
      reportId: 2,
      companyId: 2,
      serialNumber: '123456',
      address: '남구 2번',
      latitude: 35.2052295,
      longitude: 126.8117828,
      categoryId: 2,
      status: 'REPORT_COMPLETED',
      photos: { firstPhoto: '', secondPhoto: '' },
      description: 'test',
      createdAt: '2024-11-11 15:23:44',
      area: '남구',
    },
    {
      reportId: 3,
      companyId: 2,
      serialNumber: '123456',
      address: '서구 3번',
      latitude: 35.2052295,
      longitude: 126.8117828,
      categoryId: 2,
      status: 'REPORT_COMPLETED',
      photos: { firstPhoto: '', secondPhoto: '' },
      description: 'test',
      createdAt: '2024-11-11 15:23:44',
      area: '서구',
    },
  ];

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

            <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
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
        {filteredResponse.map((item) => (
          <div key={item.reportId}>
            <Link to={`${item.reportId}`}>
              <div className="rounded-lg border p-4">
                <div className="font-bold">{item.address}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div>{item.createdAt}</div>
                  {getStatus(item.status)}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;

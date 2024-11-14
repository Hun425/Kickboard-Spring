import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useReportStore } from '../../store/ReportInfoStore';

const ViolationTypeSelector: React.FC = () => {
  type ParkingType = {
    [key: number]: string;
  };

  const parkingMap: ParkingType = {
    1: '횡단보도진출입로 주차',
    2: '점자블록 주차',
    3: '어린이보호구역 주차',
    4: '자전거도로 주차',
    5: '지하철역 입구 주차',
    6: '건물및상가앞',
    7: '차도침범 주차',
    8: '버스정류소 주차',
    9: '교통섬 내부 주차',
    10: '기타',
  };

  function convertInput(input: number | string): number | string {
    if (typeof input === 'number') {
      // 숫자가 입력되면 해당 문자를 반환
      return parkingMap[input] || '해당 항목이 없습니다.';
    } else if (typeof input === 'string') {
      // 문자가 입력되면 해당 숫자를 반환
      const entry = Object.entries(parkingMap).find(
        ([, value]) => value === input
      );
      return entry ? Number(entry[0]) : '해당 항목이 없습니다.';
    }
    return '잘못된 입력입니다.';
  }

  const { categoryId, setCategoryId } = useReportStore();

  const handleOptionClick = (option: number) => {
    setCategoryId(option);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <Menu as="div" className="relative inline-block w-full text-left">
          <div className="w-full">
            <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {categoryId ? convertInput(categoryId) : '위반 유형을 선택하세요'}
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              {Object.keys(parkingMap).map((key) => {
                const numberKey = Number(key); // 객체의 key는 항상 string 형태이므로 Number로 변환
                return (
                  <MenuItem key={numberKey}>
                    {({ active }) => (
                      <div
                        onClick={() => handleOptionClick(numberKey)}
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {convertInput(numberKey)}
                      </div>
                    )}
                  </MenuItem>
                );
              })}
            </div>
          </MenuItems>
        </Menu>
      </div>
    </>
  );
};

export default ViolationTypeSelector;

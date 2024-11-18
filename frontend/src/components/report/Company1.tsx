// 킥보드 브레이커
import React from 'react';
import { Menu, MenuButton } from '@headlessui/react';

interface props {
  companyId: number;
}

const Company1: React.FC<props> = ({ companyId }) => {
  type CompanyType = {
    [key: number]: string;
  };

  const companyMap: CompanyType = {
    1: '지쿠터',
    2: '디어',
    3: '빔',
    4: '타고가',
    5: '씽씽',
  };

  function convertInput(input: number | string): number | string {
    if (typeof input === 'number') {
      return companyMap[input] || '해당 항목이 없습니다.';
    } else if (typeof input === 'string') {
      const entry = Object.entries(companyMap).find(
        ([, value]) => value === input
      );
      return entry ? Number(entry[0]) : '해당 항목이 없습니다.';
    }
    return '잘못된 입력입니다.';
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <Menu as="div" className="relative inline-block w-full text-left">
        <div className="w-full">
          <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {companyId ? convertInput(companyId) : '회사를 선택하세요'}
          </MenuButton>
        </div>
      </Menu>
    </div>
  );
};

export default Company1;

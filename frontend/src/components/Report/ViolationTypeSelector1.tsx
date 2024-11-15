import React from 'react';
import { Menu, MenuButton } from '@headlessui/react';

interface props {
  category: string;
}

const ViolationTypeSelector1: React.FC<props> = ({ category }) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <Menu as="div" className="relative inline-block w-full text-left">
          <div className="w-full">
            <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {category}
            </MenuButton>
          </div>
        </Menu>
      </div>
    </>
  );
};

export default ViolationTypeSelector1;

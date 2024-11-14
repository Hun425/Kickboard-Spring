import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

type ChooseAreaProps = {
  onSelect: (area: string) => void;
};

const areas = ['광산구', '북구', '동구', '서구', '남구'];

export default function ChooseArea({ onSelect }: ChooseAreaProps) {
  const [selectedArea, setSelectedArea] = useState('구역 선택');

  const handleSelect = (area: string) => {
    setSelectedArea(area);
    onSelect(area);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedArea}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-400"
          />
        </Menu.Button>
      </div>

      <Menu.Items className="absolute left-0 z-10 mt-2 min-w-[160px] origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {areas.map((area) => (
            <Menu.Item key={area}>
              {({ active }) => (
                <button
                  onClick={() => handleSelect(area)}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block w-full px-4 py-2 text-left text-sm`}
                >
                  {area}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}

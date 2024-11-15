// src/components/CollectCompleteModal.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import CollectCompleteModal, {
  CollectCompleteModalProps,
} from './CollectCompleteModal';
import { useState } from 'react';

export default {
  title: 'Components/CollectCompleteModal',
  component: CollectCompleteModal,
  argTypes: {
    address: { control: 'text', defaultValue: '서울특별시 강남구 테헤란로' },
    category: { control: 'text', defaultValue: '불법 주차' },
  },
} as Meta;

const Template: StoryFn<CollectCompleteModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);

  const handleSubmit = (completionImages: File | null, processType: string) => {
    alert(`이미지: ${completionImages}\n처리 유형: ${processType}`);
  };

  return (
    <>
      {isOpen && (
        <CollectCompleteModal
          {...args}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-blue-500 p-2 text-white"
      >
        Open Modal
      </button>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  address: '서울특별시 강남구 테헤란로 123',
  category: '불법 주차',
};

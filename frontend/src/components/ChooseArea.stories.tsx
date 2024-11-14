// src/components/ChooseArea.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import ChooseArea from './ChooseArea';

export default {
  title: 'Components/ChooseArea',
  component: ChooseArea,
  argTypes: {
    onSelect: { action: 'selected' }, // 뭐가 선택되었는지 스토리북의 actions 탭에서 볼 수 있음
  },
} as Meta<typeof ChooseArea>;

const Template: StoryFn<typeof ChooseArea> = (args) => <ChooseArea {...args} />;

export const Default = Template.bind({});
Default.args = {};

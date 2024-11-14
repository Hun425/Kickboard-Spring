// PhoneScreenContainer.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import PhoneScreenContainer from './phoneScreenContainer';

export default {
  title: 'Components/PhoneScreenContainer',
  component: PhoneScreenContainer,
  argTypes: {
    children: { control: 'text' },
  },
} as Meta;

const Template: StoryFn = (args) => (
  <PhoneScreenContainer>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {args.children || 'This is a simulated phone screen container.'}
    </div>
  </PhoneScreenContainer>
);

export const Default = Template.bind({});
Default.args = {
  children: '기본적인 핸드폰 화면 크기입니다.',
};

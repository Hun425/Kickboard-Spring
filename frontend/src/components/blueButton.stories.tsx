// BlueButton.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import BlueButton, { ButtonProps } from './blueButton';

export default {
  title: 'Components/BlueButton',
  component: BlueButton,
  argTypes: {
    text: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    fontSize: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<ButtonProps> = (args: ButtonProps) => (
  <BlueButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  width: '326px',
  height: '36px',
  text: '로그인',
};

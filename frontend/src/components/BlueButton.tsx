import React from 'react';

export type ButtonProps = {
  width: string;
  height: string;
  text?: string;
  fontSize?: string;
  onClick?: () => void;
};

const BlueButton: React.FC<ButtonProps> = ({
  width,
  height,
  text = 'Click Me',
  fontSize = 'text-[16px]',
  onClick,
}) => {
  return (
    <button
      className={`cursor-pointer rounded-[10px] bg-[#7CD1FF] font-bold text-white ${fontSize}`}
      style={{
        width: width,
        height: height,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default BlueButton;

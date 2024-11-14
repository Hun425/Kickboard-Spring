import React, { ReactNode } from 'react';

type PhoneScreenContainerProps = {
  children: ReactNode;
};

const PhoneScreenContainer: React.FC<PhoneScreenContainerProps> = ({
  children,
}) => {
  return (
    <div className="bg-black">
      <div
        className="h-full min-h-[100.1vh] w-full bg-white md:max-w-[412px]"
        style={{
          width: '412px',
          margin: '0 auto',
          border: '1px solid #000',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PhoneScreenContainer;

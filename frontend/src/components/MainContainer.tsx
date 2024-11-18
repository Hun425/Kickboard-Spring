import React, { ReactNode } from 'react';

type MainContainerProps = {
  children: ReactNode;
};

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-[calc(100vh-40px-65px)] w-full flex-1 overflow-y-auto border border-black px-8 py-8">
        {children}
      </div>
    </>
  );
};

export default MainContainer;

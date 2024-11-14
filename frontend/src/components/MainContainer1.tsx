import React, { ReactNode } from 'react';

type MainContainerProps = {
  children: ReactNode;
};

const MainContainer1: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-full w-full overflow-y-auto border border-black">
        {children}
      </div>
    </>
  );
};

export default MainContainer1;

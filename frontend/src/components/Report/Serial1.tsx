import React from 'react';

interface props {
  serialNumber: string;
}

const Serial1: React.FC<props> = ({ serialNumber }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <textarea
          placeholder="시리얼 넘버를 입력해주세요."
          className="my-button w-full"
          defaultValue={serialNumber}
          rows={1}
          disabled
        />
      </div>
    </>
  );
};

export default Serial1;

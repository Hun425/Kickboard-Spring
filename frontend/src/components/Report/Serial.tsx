import React from 'react';
import { useReportStore } from '../../store/ReportInfoStore';

const Serial: React.FC = () => {
  const { serialNumber, setSerialNumber } = useReportStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSerialNumber(e.target.value);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <textarea
          onChange={handleChange}
          placeholder="시리얼 넘버를 입력해주세요."
          className="my-button w-full"
          defaultValue={serialNumber ?? ''}
          rows={1}
        />
      </div>
    </>
  );
};

export default Serial;

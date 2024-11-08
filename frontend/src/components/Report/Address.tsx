import React from 'react';
import { Link } from 'react-router-dom';
import { useReportStore } from '../../store/ReportInfoStore';

const Address: React.FC = () => {
  const { address, setAddress } = useReportStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <input
          className="my-border w-full px-4 py-2 font-bold"
          onChange={handleChange}
          value={address ?? '위치를 확인해주세요'}
          disabled
        />

        <Link
          to="/map"
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          위치 확인
        </Link>
      </div>
    </>
  );
};

export default Address;

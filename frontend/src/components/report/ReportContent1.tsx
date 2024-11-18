// 킥보드 브레이커
import React from 'react';

interface props {
  descriptions: string;
}

const ReportContent1: React.FC<props> = ({ descriptions }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <textarea
        placeholder="신고할 내용을 입력하세요."
        className="my-button h-40 w-full"
        defaultValue={descriptions ?? ''}
        disabled
      />
    </div>
  );
};

export default ReportContent1;

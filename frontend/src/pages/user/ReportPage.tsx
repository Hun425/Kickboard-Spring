import React, { useEffect } from 'react';
import { useStateStore } from '../../store/StateStore';

const ReportPage: React.FC = () => {
  const { title, setTitle, setReport } = useStateStore();
  useEffect(() => {
    setTitle('전동 킥보드 주정차 위반 신고');
    setReport();
  }, [title, setTitle]);

<<<<<<< HEAD
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const reportData = {
      companyId: companyId,
      serialNumber: serialNumber,
      latitude: latitude,
      longitude: longitude,
      address: address,
      categoryId: categoryId,
      description: description,
    };

    // JSON 데이터를 Blob으로 변환하여 첨부
    const reportBlob = new Blob([JSON.stringify(reportData)], {
      type: 'application/json',
    });

    formData.append('report', reportBlob);

    if (image1) {
      formData.append('image', image1);
    }
    if (image2) {
      formData.append('image', image2);
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + '/kickboard/reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // multipart 설정
          },
        }
      );
      response;
    } catch (error) {
      console.error('Error submitting report:', error);
    }

    reset();
    navigate('/list');
  };

  const isButtonDisabled =
    !Boolean(companyId) ||
    !Boolean(serialNumber) ||
    !Boolean(address) ||
    !Boolean(image1);

>>>>>>> frontend
  return (
    <>
      <div className="min-h-[calc(100vh-40px-65px)] overflow-y-auto">
        <div>hi</div>
      </div>
    </>
  );
};

export default ReportPage;

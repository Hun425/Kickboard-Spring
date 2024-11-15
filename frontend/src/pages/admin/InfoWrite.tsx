import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import NavBar from './components/AdminNavBar';

const InfoWrite: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure content isn't just empty spaces
    if (!title.trim() || !content.trim()) {
      setErrorMessage('제목과 내용은 필수 항목입니다.');
      setResponseMessage('');
      return;
    }

    const requestBody = {
      title,
      content,
    };

    try {
      const apiUrl = `${import.meta.env.VITE_URL}/kickboard/admin/notice/create`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is not okay
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '서버 오류 발생');
      }

      const data = await response.json();

      if (data.success) {
        setResponseMessage(
          `공지사항이 등록되었습니다. ID: ${data.data.noticeId}`
        );
        setErrorMessage('');
        setTitle('');
        setContent('');
      } else {
        throw new Error(data.error?.message || '알 수 없는 오류');
      }
    } catch (error: any) {
      setErrorMessage(error.message || '알 수 없는 오류가 발생했습니다.');
      setResponseMessage('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <NavBar />
      <div className="ml-72 mr-72 mt-16">
        <h1 className="mb-10 text-center text-2xl font-bold">공지사항 등록</h1>

        <form
          onSubmit={handleSubmit}
          className="rounded bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded border p-2"
              rows={8}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
            >
              등록
            </button>
          </div>
        </form>

        {/* Display success or error message */}
        {responseMessage && (
          <p className="mt-4 text-green-500">{responseMessage}</p>
        )}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default InfoWrite;

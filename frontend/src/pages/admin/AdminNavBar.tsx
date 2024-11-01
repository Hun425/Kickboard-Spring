
import React, { useState } from 'react';

const AdminNavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-200 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 ml-10">
                    <a href="/adminMainPage" className="text-gray-700 hover:text-gray-900">신고현황</a>
                    <a href="/adminMap" className="text-gray-700 hover:text-gray-900">지도</a>
                    <a href="#" className="text-gray-700 hover:text-gray-900">계정관리</a>
                    <a href="#" className="text-gray-700 hover:text-gray-900">공지사항</a>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                  {/* Logo or Title */}
                  <div className="text-xl font-semibold mr-10">관리자 님</div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-2 space-y-2">
                    <a href="#" className="block text-gray-700 hover:text-gray-900">신고현황</a>
                    <a href="#" className="block text-gray-700 hover:text-gray-900">지도</a>
                    <a href="#" className="block text-gray-700 hover:text-gray-900">계정관리</a>
                    <a href="#" className="block text-gray-700 hover:text-gray-900">공지사항</a>
                </div>
            )}
        </nav>
    );
};

export default AdminNavBar;

import React, { useState, useMemo, useEffect } from 'react';
import KakaoMap from './components/KaKaoMap';
import { Report, ApiResponse } from '../../types';
// import { Card, CardContent } from './components/Card';
import { Skeleton } from './components/Skeleton';
import beam from './components/beam.png';
import AdminNavBar from './components/AdminNavBar'; // AdminNavBar import 추가

const AdminMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const companies = ['BEAM', 'DEER', 'SWING', 'KICK GOING', 'LIME'];
  const addresses = [
    '광주광역시 광산구 장덕동 1623-3',
    '광주광역시 광산구 수완동 1089-1',
    '광주광역시 광산구 신가동 992-1',
    '광주광역시 광산구 운남동 785-1',
    '광주광역시 광산구 첨단동 1223-3',
    '광주광역시 광산구 우산동 1026-2',
    '광주광역시 광산구 송정동 823-5',
    '광주광역시 광산구 하남동 763-1',
    '광주광역시 광산구 월곡동 552-4',
    '광주광역시 광산구 소촌동 443-2',
  ];

  const generateSampleData = (): ApiResponse => {
    const adminStatuses: Array<Report['adminStatus']> = [
      '신고접수',
      '수거중',
      '수거완료',
    ];

    const reports: Report[] = Array.from({ length: 10 }, (_, index) => ({
      reportId: `REP${String(index + 1).padStart(4, '0')}`,
      companyName: companies[Math.floor(Math.random() * companies.length)],
      serialNumber: `SN${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      latitude: 35.1595 + (Math.random() - 0.5) * 0.01,
      longitude: 126.8526 + (Math.random() - 0.5) * 0.01,
      address: addresses[index % addresses.length],
      adminStatus:
        adminStatuses[Math.floor(Math.random() * adminStatuses.length)],
      images: [beam],
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      )
        .toISOString()
        .replace('T', ' ')
        .slice(0, 16),
    }));

    return {
      success: true,
      data: {
        reports,
      },
      afterImages: reports
        .filter((report) => report.adminStatus === '수거완료')
        .map(
          (report) =>
            `/api/placeholder/400/320?text=Completed${report.reportId}`
        ),
      error: undefined,
    };
  };

  const [apiData] = useState<ApiResponse>(generateSampleData());

  const sortedAndFilteredReports = useMemo(() => {
    let filtered =
      statusFilter === 'all'
        ? apiData.data.reports
        : apiData.data.reports.filter(
            (report) => report.adminStatus === statusFilter
          );

    return filtered;
  }, [apiData.data.reports, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {/* AdminNavBar 컴포넌트를 페이지 상단에 추가 */}
      <AdminNavBar />

      <div className="mx-auto max-w-7xl p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* 지도 영역의 높이를 800px로 설정 */}
            <div
              className="rounded-lg bg-white p-4"
              style={{ height: '500px' }}
            >
              {isLoading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : (
                <KakaoMap
                  selectedReport={selectedReport}
                  reports={sortedAndFilteredReports}
                  onSelectReport={setSelectedReport}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;

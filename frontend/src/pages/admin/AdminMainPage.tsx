import React, { useState, useMemo, useEffect } from 'react';
import AdminNavBar from './components/AdminNavBar';
import { Card, CardContent } from './components/Card';
import { TableSkeleton, Skeleton } from './components/Skeleton';
import beam from './components/beam.png';

import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from 'react-icons/ti';
import KakaoMap from './components/KaKaoMap';
import IncidentDetails from './components/IncidentDetail';
import { Report, ApiResponse } from '../../types';
import IncidentImage from './components/IncidentImage';

const AdminMain: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );

  const statusItems = [
    {
      label: '신고접수',
      count: 10,
      colorClass: 'bg-red-500',
      value: '신고접수',
    },
    {
      label: '수거중',
      count: 10,
      colorClass: 'bg-yellow-500',
      value: '수거중',
    },
    {
      label: '수거완료',
      count: 10,
      colorClass: 'bg-green-500',
      value: '수거완료',
    },
  ];

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

  const handleStatusChange = async (newStatus: Report['adminStatus']) => {
    if (!selectedReport) return;

    setIsLoading(true);
    try {
      const updatedReports = apiData.data.reports.map((report) =>
        report.reportId === selectedReport.reportId
          ? { ...report, adminStatus: newStatus }
          : report
      );

      setSelectedReport({ ...selectedReport, adminStatus: newStatus });
      apiData.data.reports = updatedReports;
    } catch (error) {
      console.error('상태 변경 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof Report) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Report) => {
    if (sortField !== field)
      return <TiArrowUnsorted className="ml-2 inline h-4 w-4" />;
    if (sortDirection === 'asc')
      return <TiArrowSortedUp className="ml-2 inline h-4 w-4" />;
    if (sortDirection === 'desc')
      return <TiArrowSortedDown className="ml-2 inline h-4 w-4" />;
    return null;
  };

  const sortedAndFilteredReports = useMemo(() => {
    let filtered =
      statusFilter === 'all'
        ? apiData.data.reports
        : apiData.data.reports.filter(
            (report) => report.adminStatus === statusFilter
          );

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [apiData.data.reports, statusFilter, sortField, sortDirection]);

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
  };

  const TableHeader: React.FC<{
    field: keyof Report;
    children: React.ReactNode;
    // TODO : 지영 임시 수정
    className?: string;
    // ---------------
  }> = ({ field, children }) => (
    <th
      className="sticky top-0 z-10 cursor-pointer bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <AdminNavBar />
      <div className="mx-auto max-w-7xl p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-4">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <KakaoMap
                  selectedReport={selectedReport}
                  reports={sortedAndFilteredReports}
                  onSelectReport={setSelectedReport}
                />
              )}
            </div>

            <div className="rounded-lg bg-white p-4">
              <div className="grid grid-cols-1 gap-4">
                {selectedReport?.images.map((image, index) => (
                  <IncidentImage
                    key={index}
                    imageUrl={image}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white">
              <IncidentDetails
                report={selectedReport}
                isLoading={isLoading}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
          <Card>
            <CardContent>
              <div className="mb-4">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      statusFilter === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    } rounded-l-lg border-r border-gray-200`}
                    onClick={() => setStatusFilter('all')}
                  >
                    전체
                  </button>
                  {statusItems.map((item, index) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`px-4 py-2 text-sm font-medium ${
                        statusFilter === item.value
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      } ${
                        index === statusItems.length - 1
                          ? 'rounded-r-lg'
                          : 'border-r border-gray-200'
                      }`}
                      onClick={() => setStatusFilter(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <TableHeader field="createdAt">신고 일시</TableHeader>
                        <TableHeader field="companyName">업체명</TableHeader>
                        <TableHeader field="serialNumber">
                          시리얼 번호
                        </TableHeader>
                        <TableHeader field="address">주소</TableHeader>
                        <TableHeader field="adminStatus">처리 상태</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5}>
                            <TableSkeleton />
                          </td>
                        </tr>
                      ) : (
                        sortedAndFilteredReports.map((report) => (
                          <tr
                            key={report.reportId}
                            onClick={() => handleRowClick(report)}
                            className={`cursor-pointer border-t hover:bg-gray-50 ${
                              selectedReport?.reportId === report.reportId
                                ? 'bg-blue-50'
                                : ''
                            }`}
                          >
                            <td className="p-2">{report.createdAt}</td>
                            <td className="p-2">{report.companyName}</td>
                            <td className="p-2">{report.serialNumber}</td>
                            <td className="p-2">{report.address}</td>
                            <td className="p-2">{report.adminStatus}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;

import React, { useState, useMemo, useEffect } from 'react';
import AdminNavBar from './components/AdminNavBar';
import { Card, CardContent } from './components/Card';
import { TableSkeleton, Skeleton } from './components/Skeleton';
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from 'react-icons/ti';
import KakaoMap from './components/KaKaoMap';
import IncidentDetails from './components/IncidentDetail';
import { Report } from '../../types/index';
import IncidentImage from './components/IncidentImage';
import { fetchReports } from './api/adminApi';

// adminStatus 한글 변환을 위한 매핑 객체
const statusMap: Record<string, string> = {
  'REPORT_RECEIVED': '신고접수',
  'COLLECT_RECEIVED': '수거접수',
  'COLLECT_PROGRESS': '수거중',
  'COLLECT_COMPLETED': '수거완료',
  'REPORT_COMPLETED': '신고처리완료'
};

const AdminMain: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    const counts = {
      '신고접수': 0,
      '수거중': 0,
      '신고처리완료': 0
    };
    
    reports.forEach(report => {
      if (report.adminStatus === 'REPORT_RECEIVED') {
        counts['신고접수']++;
      } else if (report.adminStatus === 'REPORT_COMPLETED') {
        counts['신고처리완료']++;
      } else if (report.adminStatus.startsWith('COLLECT_')) {
        counts['수거중']++;
      }
    });
    
    return counts;
  }, [reports]);

  const statusItems = useMemo(() => [
    { label: '신고접수', count: statusCounts['신고접수'], colorClass: 'bg-red-500', value: 'REPORT_RECEIVED' },
    { label: '수거중', count: statusCounts['수거중'], colorClass: 'bg-yellow-500', value: 'COLLECT_PROGRESS' },
    { label: '처리완료', count: statusCounts['신고처리완료'], colorClass: 'bg-green-500', value: 'REPORT_COMPLETED' },
  ], [statusCounts]);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        const response = await fetchReports('광산구');
        if (response.success && response.data) {
          setReports(response.data.reports);
        } else {
          setError(response.error?.message || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);  
      }
    };

    loadReports();
  }, []);

  const handleStatusChange = async (newStatus: Report['adminStatus']) => {
    if (!selectedReport) return;

    setIsLoading(true);
    try {
      // 여기에 상태 업데이트를 위한 API 호출을 추가할 수 있습니다.
      const updatedReports = reports.map((report) =>
        report.reportId === selectedReport.reportId
          ? { ...report, adminStatus: newStatus }
          : report
      );

      setSelectedReport({ ...selectedReport, adminStatus: newStatus });
      setReports(updatedReports);
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
        ? reports
        : reports.filter((report) => report.adminStatus === statusFilter);

        if (sortField && sortDirection) {
          filtered = [...filtered].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
        
            if (aValue === undefined && bValue === undefined) return 0; // 둘 다 undefined이면 순서 유지
            if (aValue === undefined) return 1; // aValue가 undefined면 bValue가 앞에
            if (bValue === undefined) return -1; // bValue가 undefined면 aValue가 앞에
        
            if (sortDirection === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }
        
    return filtered;
  }, [reports, statusFilter, sortField, sortDirection]);

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
    console.log(report);
  };

  const TableHeader: React.FC<{
    field: keyof Report;
    children: React.ReactNode;
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

  return (
    <div className="w-full font-KoPubMedium">
      <AdminNavBar 
        isLoading={isLoading}
        statusItems={statusItems}
      />
      <div className="mx-auto max-w-7xl p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

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
                            <td className="p-2">{statusMap[report.adminStatus] || report.adminStatus}</td>
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

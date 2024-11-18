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
  REPORT_RECEIVED: '신고접수',
  COLLECT_RECEIVED: '수거접수',
  COLLECT_PROGRESS: '수거중',
  COLLECT_COMPLETED: '수거완료',
  REPORT_COMPLETED: '신고처리완료',
};

const AdminMain: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const statusStyles = {
    REPORT_RECEIVED: {
      bgClass: 'bg-red-100',
      textClass: 'text-red-600',
    },
    COLLECT_RECEIVED: {
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-600',
    },
    COLLECT_PROGRESS: {
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
    },
    COLLECT_COMPLETED: {
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
    },
    REPORT_COMPLETED: {
      bgClass: 'bg-green-100',
      textClass: 'text-green-600',
    },
  };

  // 회사별 색상 매핑
  const companyColors: { [key: string]: string } = {
    빔: '#7448ff',
    디어: '#ffe301',
    지쿠터: '#34d025',
    타고가: '#f88379',
    씽씽: '#ffd939',
  };
  const statusCounts = useMemo(() => {
    const counts = {
      신고접수: 0,
      수거접수: 0,
      수거중: 0,
      수거완료: 0,
      신고처리완료: 0,
    };

    reports.forEach((report) => {
      if (report.adminStatus === 'REPORT_RECEIVED') {
        counts['신고접수']++;
      } else if (report.adminStatus === 'REPORT_COMPLETED') {
        counts['신고처리완료']++;
      } else if (report.adminStatus === 'COLLECT_RECEIVED') {
        counts['수거접수']++;
      } else if (report.adminStatus === 'COLLECT_PROGRESS') {
        counts['수거중']++;
      } else if (report.adminStatus === 'COLLECT_COMPLETED') {
        counts['수거완료']++;
      }
    });

    return counts;
  }, [reports]);

  const statusItems = useMemo(
    () => [
      {
        label: '신고접수',
        count: statusCounts['신고접수'],
        colorClass: 'bg-red-500',
        value: 'REPORT_RECEIVED',
      },
      {
        label: '수거접수',
        count: statusCounts['수거접수'],
        colorClass: 'bg-orange-500',
        value: 'COLLECT_RECEIVED',
      },
      {
        label: '수거중',
        count: statusCounts['수거중'],
        colorClass: 'bg-yellow-500',
        value: 'COLLECT_PROGRESS',
      },
      {
        label: '수거완료',
        count: statusCounts['수거완료'],
        colorClass: 'bg-blue-500',
        value: 'COLLECT_COMPLETED',
      },
      {
        label: '처리완료',
        count: statusCounts['신고처리완료'],
        colorClass: 'bg-green-500',
        value: 'REPORT_COMPLETED',
      },
    ],
    [statusCounts]
  );

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        const response = await fetchReports();
        if (response.success && response.data) {
          setReports(response.data.reports);
        } else {
          setError(
            response.error?.message || '데이터를 불러오는데 실패했습니다.'
          );
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

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };
  const CompanyName: React.FC<{ name: string }> = ({ name }) => {
    const baseCompanyName = Object.keys(companyColors).find((company) =>
      name.toLowerCase().includes(company.toLowerCase())
    );

    return baseCompanyName ? (
      <span
        style={{ color: companyColors[baseCompanyName] }}
        className="font-semibold"
      >
        {name}
      </span>
    ) : (
      <span>{name}</span>
    );
  };

  return (
    <div className="w-full font-KoPubMedium">
      <AdminNavBar />
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
                        sortedAndFilteredReports.map((report) => {
                          const statusStyle = statusStyles[report.adminStatus];

                          return (
                            <tr
                              key={report.reportId}
                              onClick={() => handleRowClick(report)}
                              className={`cursor-pointer border-t hover:bg-gray-50 ${
                                selectedReport?.reportId === report.reportId
                                  ? 'bg-blue-50'
                                  : ''
                              }`}
                            >
                              <td className="p-2">
                                {getFormattedDate(report.createdAt)}
                              </td>
                              <td className="p-2">
                                <CompanyName name={report.companyName} />
                              </td>
                              <td className="p-2">{report.serialNumber}</td>
                              <td className="p-2">{report.address}</td>
                              <td className="p-2">
                                <span
                                  className={`rounded-full px-2 py-1 ${statusStyle?.bgClass} ${statusStyle?.textClass}`}
                                >
                                  {statusMap[report.adminStatus] ||
                                    report.adminStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })
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

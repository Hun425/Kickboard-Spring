import React, { useState, useMemo, useEffect } from 'react';
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from 'react-icons/ti';

// Card Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`rounded-lg bg-white shadow-sm ${className}`}>{children}</div>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Select Components
const Select: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[180px] items-center justify-between rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        {value === 'all' ? '전체' : value}
        <TiArrowSortedDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  onClick: () => {
                    onValueChange(child.props.value);
                    setIsOpen(false);
                  },
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SelectItem: React.FC<{
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <div
    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
    onClick={onClick}
  >
    {children}
  </div>
);

// Navigation Bar Component
const AdminNavBar: React.FC = () => (
  <nav className="bg-white shadow">
    <div className="mx-auto max-w-6xl px-4 py-4">
      <h1 className="text-xl font-semibold">관리자 대시보드</h1>
    </div>
  </nav>
);

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'date' | 'board' | 'category' | 'content' | 'status' | null;

interface IncidentReport {
  id: string;
  date: string;
  board: string;
  category: string;
  content: string;
  status: '대기 중' | '수거 중' | '수거 완료';
  location: string;
  details: {
    state: string;
    reportDate: string;
    boardInfo: string;
    category: string;
    description: string;
  };
}

interface StatusItem {
  label: string;
  count: number;
  color: string;
  value: '대기 중' | '수거 중' | '수거 완료';
}
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
);

const TableSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4 py-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 flex-grow" />
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

const AdminMain: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const statusItems: StatusItem[] = [
    { label: '대기중', count: 10, color: 'red', value: '대기 중' },
    { label: '수거중', count: 10, color: 'green', value: '수거 중' },
    { label: '수거완료', count: 10, color: 'blue', value: '수거 완료' },
  ];

  const generateSampleData = (count: number): IncidentReport[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${index + 1}`,
      date: '2024.11.01 11:00',
      board: 'BEAM',
      category: '어빈이 보호구역 주차',
      content: '어빈이 보호구역 주차지 신고합니다.\n되도록 빨리 처리해주세요',
      status:
        index % 3 === 0 ? '대기 중' : index % 3 === 1 ? '수거 중' : '수거 완료',
      location: `(처리 ${index % 3 === 0 ? '전' : index % 3 === 1 ? '중' : '완료'}) 광주광역시 광산구`,
      details: {
        state:
          index % 3 === 0
            ? '신고접수'
            : index % 3 === 1
              ? '처리중'
              : '처리완료',
        reportDate: '2024.10.29',
        boardInfo: 'BEAM',
        category: '어빈이 보호구역 주차',
        description:
          '어빈이 보호구역 주차 신고합니다.\n되도록 빨리 처리해주세요',
      },
    }));
  };

  const incidentData = generateSampleData(50);

  const handleSort = (field: SortField) => {
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <TiArrowUnsorted className="ml-2 inline h-4 w-4" />;
    if (sortDirection === 'asc')
      return <TiArrowSortedUp className="ml-2 inline h-4 w-4" />;
    if (sortDirection === 'desc')
      return <TiArrowSortedDown className="ml-2 inline h-4 w-4" />;
    return null;
  };

  const sortedAndFilteredIncidents = useMemo(() => {
    let filtered =
      statusFilter === 'all'
        ? incidentData
        : incidentData.filter((incident) => incident.status === statusFilter);

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
  }, [statusFilter, sortField, sortDirection]);

  const handleRowClick = (incident: IncidentReport) => {
    setSelectedIncident(incident);
  };

  const TableHeader: React.FC<{
    field: SortField;
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

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="w-full">
      <AdminNavBar />
      <div className="mx-auto max-w-6xl p-4">
        {/* Status Indicators */}
        <div className="mb-4 rounded-lg bg-white shadow">
          <div className="flex justify-end gap-4 p-2">
            {isLoading ? (
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            ) : (
              statusItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full bg-${item.color}-500`}
                  ></div>
                  <span>
                    {item.label} {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Map Section */}
          <Card className="p-4">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-gray-500">지도 영역</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedIncident?.location || '(위치를 선택해주세요)'}
                </p>
              </>
            )}
          </Card>

          {/* Details Section */}
          <Card className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="ml-4 h-6 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedIncident ? (
                  <>
                    <div className="flex">
                      <div className="w-24 text-gray-600">현재 상태</div>
                      <div className="flex-1">
                        {selectedIncident.details.state}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-600">신고 일시</div>
                      <div className="flex-1">
                        {selectedIncident.details.reportDate}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-600">킥보드 정보</div>
                      <div className="flex-1">
                        {selectedIncident.details.boardInfo}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-600">신고 구분</div>
                      <div className="flex-1">
                        {selectedIncident.details.category}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-600">신고 내용</div>
                      <div className="flex-1">
                        {selectedIncident.details.description}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    신고 내역을 선택해주세요
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Table Section */}
        <Card className="mt-4">
          <CardContent>
            <div className="mb-4 flex justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectItem value="all">전체</SelectItem>
                {statusItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <TableHeader field="date" className="w-32">
                        신고 일시
                      </TableHeader>
                      <TableHeader field="board" className="w-28">
                        킥보드 정보
                      </TableHeader>
                      <TableHeader field="category" className="w-36">
                        신고 구분
                      </TableHeader>
                      <TableHeader field="content">신고 내용</TableHeader>
                      <TableHeader field="status" className="w-24">
                        현재 상태
                      </TableHeader>
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
                      sortedAndFilteredIncidents.map((incident) => (
                        <tr
                          key={incident.id}
                          onClick={() => handleRowClick(incident)}
                          className={`cursor-pointer border-t hover:bg-gray-50 ${
                            selectedIncident?.id === incident.id
                              ? 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <td className="p-2">{incident.date}</td>
                          <td className="p-2">{incident.board}</td>
                          <td className="p-2">{incident.category}</td>
                          <td className="p-2">
                            {truncateText(incident.content, 50)}
                          </td>
                          <td className="p-2">{incident.status}</td>
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
  );
};

export default AdminMain;

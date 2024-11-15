// types.ts

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Report {
  reportId: string;
  companyName: string;
  serialNumber: string;
  latitude: number;
  longitude: number;
  address: string;
  adminStatus:
    | 'REPORT_RECEIVED' // 신고접수
    | 'COLLECT_RECEIVED' // 수거접수
    | 'COLLECT_PROGRESS' // 수거중
    | 'COLLECT_COMPLETED' // 수거완료
    | 'REPORT_COMPLETED'; // 신고처리완료
  images: string[];
  afterImages: string[];
  createdAt: string;
  content?: string;
  category?: string;
  description: string;
  details?: {
    state: string;
    reportDate: string;
    companyInfo: string;
    category: string;
    description: string;
  };
}

export interface StatusItem {
  label: string;
  count: number;
  color: string;
  value: Report['adminStatus'];
}

export interface ApiResponse {
  success: boolean;
  data: {
    reports: Report[];
  };
  afterImages: string[];
  error?: {
    code: string;
    message: string;
  };
}

export type SortDirection = 'asc' | 'desc' | null;
export type SortField = keyof Report | null;

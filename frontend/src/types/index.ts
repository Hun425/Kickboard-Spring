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
    | '신고접수'
    | '수거요청'
    | '처리전'
    | '처리중'
    | '처리완료'
    | '수거완료';
  images: string[];
  createdAt: string;
  content?: string;
  category?: string;
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

// src/services/api.tsx
import axios from 'axios';
import { useCollectorAuthStore } from '../store/CollectorAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 백엔드로 보낼때
const api = axios.create({
  baseURL: BASE_URL, // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    'Content-Type': 'application/json',
  },
});

// 필요한 api function들 만들기

// (수거업체) 로그인한 순간부터는 Bearer 토큰 같이 보내자
api.interceptors.request.use(
  (config) => {
    const accessToken = useCollectorAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 수거업체 로그인
export const collectorLogin = async (email: string, password: string) => {
  try {
    const response = await api.post('/kickboard/collector/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('로그인 불가', error);
    throw error;
  }
};

// 수거업체 수거 리스트 받기위해 백엔드로 요청
export const fetchCollectLists = async () => {
  try {
    const response = await api.get(`/kickboard/collector/reports`);
    return response;
  } catch (error) {
    console.error('수거 리스트 받지 못함: ', error);
    throw error;
  }
};

// 수거업체 쪽에서 관리자한테 수거 시작 & 처리 완료 알림 보내기
// patch
// `/kickboard/collector/reports${reportId}`
// 보내줘야할 것 : status : string, completionImages : string, processType: string (처리 카테고리)
// status 종류 : 수거접수(COLLECT_RECEIVED), 수거중(COLLECT_PROGRESS), 수거완료(COLLECT_COMPLETED)
// processType 처리 종류 : 없음(NOT_EXIST), 이동(MOVE), 견인(TOW), 세움(PARK)
export const updateReportStatus = async (
  reportId: string,
  status: 'COLLECT_RECEIVED' | 'COLLECT_PROGRESS' | 'COLLECT_COMPLETED',
  completionImages?: File, // Update to File type
  processType?: string
) => {
  try {
    // Create FormData and append required fields
    const formData = new FormData();
    formData.append('status', status);

    // Append image only if provided
    if (completionImages) {
      formData.append('completionImages', completionImages); // Ensure it’s appended as a file
    }

    // Append process type if provided
    if (processType) {
      formData.append('processType', processType);
    }

    // Print FormData contents for debugging
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Send the request with FormData and appropriate headers
    const response = await api.patch(
      `/kickboard/collector/reports/${reportId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set Content-Type explicitly
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('수거 status 업데이트 실패:', error);
    throw error;
  }
};

export default api;

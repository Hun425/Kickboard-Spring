import { ApiResponse } from '../../../types/index';

const BASE_URL = import.meta.env.VITE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const fetchReports = async (): Promise<ApiResponse> => {
  try {
    const area = localStorage.getItem('area');
    if (!area) {
      throw new Error('No area found in localStorage');
    }

    const response = await fetch(
      `${BASE_URL}/kickboard/admin/reports?area=${area}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('area');
        window.location.href = '/login';
        throw new Error('Unauthorized access');
      }
      const errorText = await response.text();
      console.error('API request failed:', errorText);
      throw new Error('API request failed');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const updateReportStatus = async (
  reportId: string,
  status: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/kickboard/admin/reports/${reportId}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('area');
        window.location.href = '/login';
        throw new Error('Unauthorized access');
      }
      const errorText = await response.text();
      console.error('Status update failed:', errorText);
      throw new Error('Status update failed');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const postReport = async (reportId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/kickboard/collections/${reportId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('area');
        window.location.href = '/login';
        throw new Error('Unauthorized access');
      }
      const errorText = await response.text();
      console.error('Status update failed:', errorText);
      throw new Error('Status update failed');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

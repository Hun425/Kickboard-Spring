import { ApiResponse } from '../../../types/index';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchReports = async (area: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/kickboard/admin/reports?area=${area}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', errorText);
      throw new Error('API request failed');
    }

    const data: ApiResponse = await response.json();
    console.log(data);

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
  console.log(reportId, status);

  try {
    const response = await fetch(
      `${BASE_URL}/kickboard/admin/reports/${reportId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
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
  console.log(reportId);

  try {
    const response = await fetch(
      `${BASE_URL}/kickboard/collections/${reportId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
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

export const areas = ['광산구', '동구', '북구', '남구', '서구'] as const;
export type Area = (typeof areas)[number];

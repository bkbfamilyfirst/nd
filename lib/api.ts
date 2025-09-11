import axios, { AxiosError } from 'axios';
import { 
  getAccessToken, 
  logout, 
  setAccessToken, 
  isTokenExpired,
  canAttemptRefresh,
  getRefreshState,
  addToFailedQueue,
  setRefreshingState,
  processFailedQueue
} from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.familyfirst.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refreshing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and we haven't already tried to refresh
    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      
      // If this is a refresh token request that failed, logout immediately
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.error('Refresh token request failed, redirecting to login');
        logout();
        return Promise.reject(error);
      }

      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      const accessToken = getAccessToken();
      
      // Check if we have a token and if it's actually expired
      if (!accessToken || !isTokenExpired(accessToken)) {
        console.error('No token or token not expired, redirecting to login');
        logout();
        return Promise.reject(error);
      }

      // Check if we can attempt refresh (cooldown period)
      if (!canAttemptRefresh()) {
        console.error('Refresh cooldown active, redirecting to login');
        logout();
        return Promise.reject(error);
      }

      const { isRefreshing } = getRefreshState();

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addToFailedQueue(
            (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            (err: any) => {
              reject(err);
            }
          );
        });
      }

      // Set refreshing state to prevent multiple simultaneous refresh attempts
      setRefreshingState(true);

      try {
        console.log('Attempting to refresh token...');
        
        // Attempt to refresh the token
        const response = await api.post('/auth/refresh-token');
        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token received from refresh endpoint');
        }

        // Update the stored access token using our utility
        setAccessToken(newAccessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process the failed queue with the new token
        processFailedQueue(null, newAccessToken);

        console.log('Token refresh successful');

        // Retry the original request
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Process the failed queue with error
        processFailedQueue(refreshError, null);
        
        // Clear auth state and redirect to login
        logout();
        
        return Promise.reject(refreshError);
      } finally {
        // Reset refreshing state
        setRefreshingState(false);
      }
    }

    return Promise.reject(error);
  }
);

// ND (National Distributor) Interfaces
export interface StateSupervisor {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  assignedKeys: number;
  usedKeys: number;
  createdBy: string;
  address: string;
  status: "active" | "inactive" | "blocked";
  createdAt?: string;
  updatedAt?: string;
  keysAllocated?: number;
}

export interface SsStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  totalKeys: number;
}

export interface KeyTransferLog {
  transferId: string;
  timestamp: string;
  from: {
    id: string;
    name: string;
    role: string;
  } | null;
  to: {
    id: string;
    name: string;
    role: string;
  } | null;
  count: number;
  status: string;
  type: string;
  notes?: string;
}

export interface KeyTransferLogsResponse {
  total: number;
  page: number;
  limit: number;
  logs: KeyTransferLog[];
}

export interface NdReportsSummary {
  totalReceivedKeys: number;
  totalTransferredKeys: number;
  assignedKeys: number;
  usedKeys: number;
  balanceKeys: number;
  transferRate: number;
  totalActivations: number;
  totalKeysTransferred: number;
}

export interface NdProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
  assignedKeys: number;
  usedKeys: number;
  address?: string;
  bio?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// ND API Functions

// GET /nd/ss-list
export const getNdSsList = async (): Promise<StateSupervisor[]> => {
  try {
    const response = await api.get('/nd/ss-list');
    return response.data.ss;
  } catch (error) {
    console.error('Error fetching ND SS list:', error);
    throw error;
  }
};

// GET /nd/ss-stats
export const getNdSsStats = async (): Promise<SsStats> => {
  try {
    const response = await api.get('/nd/ss-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching ND SS stats:', error);
    throw error;
  }
};

// GET /nd/key-transfer-logs
export const getNdKeyTransferLogs = async (
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
  status?: string,
  type?: string,
  search?: string
): Promise<KeyTransferLogsResponse> => {
  try {
    const response = await api.get('/nd/key-transfer-logs', {
      params: {
        page,
        limit,
        startDate,
        endDate,
        status,
        type,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ND key transfer logs:', error);
    throw error;
  }
};

// GET /nd/key-transfer-logs/export
export const exportNdKeyTransferLogs = async (filters: {
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
  search?: string;
}) => {
  try {
    const response = await api.get('/nd/key-transfer-logs/export', {
      params: filters,
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'key-transfer-logs.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    
    return { message: "Export initiated successfully." };
  } catch (error) {
    console.error('Error exporting ND key transfer logs:', error);
    throw error;
  }
};

// GET /nd/reports/summary
export const getNdReportsSummary = async (): Promise<NdReportsSummary> => {
  try {
    const response = await api.get('/nd/reports/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching ND reports summary:', error);
    throw error;
  }
};

// DELETE /nd/ss/:id
export const deleteNdSs = async (ssId: string) => {
  try {
    const response = await api.delete(`/nd/ss/${ssId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ND SS:', error);
    throw error;
  }
};

// PUT /nd/ss/:id
export const updateNdSs = async (ssId: string, updates: Partial<StateSupervisor>) => {
  try {
    const response = await api.put(`/nd/ss/${ssId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating ND SS:', error);
    throw error;
  }
};

// GET /nd/profile
export const getNdProfile = async (): Promise<NdProfile> => {
  try {
    const response = await api.get('/nd/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching ND profile:', error);
    throw error;
  }
};

// PUT /nd/profile
export const updateNdProfile = async (updates: Partial<NdProfile>) => {
  try {
    const response = await api.put('/nd/profile', updates);
    return response.data;
  } catch (error) {
    console.error('Error updating ND profile:', error);
    throw error;
  }
};

// POST /nd/ss
export const addNdSs = async (ssData: {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  status?: string;
  assignedKeys?: number;
  password: string;
}) => {
  try {
    const response = await api.post('/nd/ss', ssData);
    return response.data;
  } catch (error) {
    console.error('Error adding ND SS:', error);
    throw error;
  }
};

// POST /nd/transfer-keys-to-ss
export const transferKeysToSs = async (transferData: {
  ssId: string;
  keysToTransfer: number;
  notes?: string;
}) => {
  try {
    const response = await api.post('/nd/transfer-keys-to-ss', transferData);
    return response.data;
  } catch (error) {
    console.error('Error transferring keys to SS:', error);
    throw error;
  }
};

// POST /auth/login
export const login = async (credentials: { identifier: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    // Re-throw a standardized error for consistency
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error; // Re-throw original error if it's not a standard Error object
  }
};

export default api;
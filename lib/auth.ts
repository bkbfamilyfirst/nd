/**
 * Authentication utility functions
 */

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Check if user is authenticated by verifying the presence of access token
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side rendering, assume not authenticated
    return false;
  }
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  if (isTokenExpired(token)) return false;
  return true;
};

/**
 * Get the current access token
 * @returns access token string or null
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('accessToken');
};

/**
 * Check if token is expired by examining its structure
 * Note: This is a basic check. For JWT tokens, you'd decode and check exp claim
 * @param token - The token to check
 * @returns boolean indicating if token is likely expired
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // For JWT tokens, you would decode and check the 'exp' claim
    // This is a simple implementation - adjust based on your token format
    const parts = token.split('.');
    if (parts.length !== 3) return true; // Not a valid JWT
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp ? payload.exp < now : false;
  } catch (error) {
    // If we can't parse the token, assume it's expired
    return true;
  }
};

/**
 * Clear authentication data and redirect to login
 */
export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('accessToken');
  
  // Reset refresh state
  isRefreshing = false;
  failedQueue = [];
  lastRefreshAttempt = 0;
  
  window.location.href = '/login';
};

/**
 * Set access token in localStorage
 * @param token - The access token to store
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('accessToken', token);
};

/**
 * Check if we can attempt a refresh (cooldown period)
 */
export const canAttemptRefresh = (): boolean => {
  const now = Date.now();
  return now - lastRefreshAttempt > REFRESH_COOLDOWN;
};

/**
 * Get refresh state information
 */
export const getRefreshState = () => ({
  isRefreshing,
  failedQueue: failedQueue.length,
  lastRefreshAttempt,
  canRefresh: canAttemptRefresh(),
});

/**
 * Add a request to the failed queue
 */
export const addToFailedQueue = (resolve: (value: any) => void, reject: (error: any) => void) => {
  failedQueue.push({ resolve, reject });
};

/**
 * Set refreshing state
 */
export const setRefreshingState = (refreshing: boolean) => {
  isRefreshing = refreshing;
  if (refreshing) {
    lastRefreshAttempt = Date.now();
  }
};

/**
 * Process the failed queue
 */
export const processFailedQueue = processQueue;

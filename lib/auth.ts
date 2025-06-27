/**
 * Authentication utility functions
 */

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
  return !!token;
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
 * Clear authentication data and redirect to login
 */
export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('accessToken');
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

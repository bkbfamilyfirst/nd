/**
 * Authentication debug utilities
 * Use these functions to monitor auth state in development
 */

import { getRefreshState, getAccessToken, isTokenExpired } from './auth';

/**
 * Log current authentication state
 */
export const logAuthState = () => {
  const token = getAccessToken();
  const refreshState = getRefreshState();
  
  console.group('🔐 Auth State Debug');
  console.log('Has Token:', !!token);
  console.log('Token Expired:', token ? isTokenExpired(token) : 'N/A');
  console.log('Is Refreshing:', refreshState.isRefreshing);
  console.log('Failed Queue Length:', refreshState.failedQueue);
  console.log('Can Refresh:', refreshState.canRefresh);
  console.log('Last Refresh Attempt:', new Date(refreshState.lastRefreshAttempt).toISOString());
  
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token Payload:', {
          exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiry',
          iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No issued time',
          sub: payload.sub || 'No subject',
        });
      }
    } catch (e) {
      console.log('Token Parse Error:', e);
    }
  }
  
  console.groupEnd();
};

/**
 * Monitor auth state changes
 */
export const startAuthMonitoring = () => {
  if (typeof window === 'undefined') return;
  
  let lastToken = getAccessToken();
  
  const monitor = () => {
    const currentToken = getAccessToken();
    
    if (currentToken !== lastToken) {
      console.log('🔄 Token Changed:', {
        had: !!lastToken,
        has: !!currentToken,
        time: new Date().toISOString(),
      });
      lastToken = currentToken;
    }
  };
  
  // Check every 5 seconds
  const intervalId = setInterval(monitor, 5000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

/**
 * Force log auth state in console (for development)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuth = {
    logState: logAuthState,
    startMonitoring: startAuthMonitoring,
  };
  
  console.log('🛠️ Auth Debug Tools Available: window.debugAuth');
}

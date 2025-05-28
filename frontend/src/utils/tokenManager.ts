import Swal from 'sweetalert2';
import API from '../lib/api';

// Timer references for managing token refresh & session expiration
let tokenTimeout10: any = null;
let tokenTimeout5: any = null;
let expireWarningTimeout: any = null;
let expireActivityHandler: any = null;

/**
 * Stores access token and calculated expiry time in sessionStorage.
 * @param token JWT access token
 * @param issued_at UNIX timestamp (seconds)
 * @param expires_in Seconds till expiration
 */
function setTokenInSession(token: string, issued_at: number, expires_in: number) {
  // Calculate absolute expiry in milliseconds (like Date.now())
  const expiresAt = (issued_at + expires_in) * 1000;
  sessionStorage.setItem('access_token', token);
  sessionStorage.setItem('tokenExpiresAt', expiresAt.toString());

  // Debug for diagnosing token issues
  console.log('[TokenManager] Set token in session:', {
    token,
    issued_at,
    expires_in,
    expiresAt,
    now: Date.now()
  });
}

/**
 * Refreshes the JWT access token using student info from sessionStorage.
 * Only triggers token refresh and resets all timers on success.
 */
export async function refreshToken() {
  const studentInfo = JSON.parse(sessionStorage.getItem('studentInfo') || '{}');
  if (!studentInfo?.student_id) return;
  try {
    const tokenRes = await API.post('/auth/iframe-token', studentInfo);
    // Debug log for diagnosing token structure
    console.log('[TokenManager] RefreshToken - API response:', tokenRes.data);

    setTokenInSession(tokenRes.data.token, tokenRes.data.issued_at, tokenRes.data.expires_in);
    // After refresh, re-initialize timers based on new expiry
    setupTokenRefreshTimers();
  } catch (error) {
    // On failure, clear all timers and show error modal
    clearTokenTimers();
    Swal.fire({
      icon: 'error',
      title: 'Token Refresh Failed!',
      text: 'Could not refresh session token. Please try again or reload the note.',
      confirmButtonText: 'OK'
    });
  }
}

/**
 * Call this after first token is received (on login/start).
 * Stores the token and schedules all timers.
 */
export function handleInitialToken(tokenRes: any) {
  // Debug log for diagnosing token structure
  console.log('[TokenManager] handleInitialToken - API response:', tokenRes);

  setTokenInSession(tokenRes.token, tokenRes.issued_at, tokenRes.expires_in);
  setupTokenRefreshTimers();
}

/**
 * Sets up one-time timers for 10 and 5 minutes before token expiry.
 * Should be called only once after token is created or refreshed.
 */
export function setupTokenRefreshTimers() {
  // Always clear previous timers before setting new ones
  clearTokenTimers();

  const expiresAt = Number(sessionStorage.getItem('tokenExpiresAt'));
  const now = Date.now();

  // Calculate delay for each timer (in milliseconds)
  const t10 = expiresAt - now - 10 * 60 * 1000; // 10 min before expiry
  const t5 = expiresAt - now - 5 * 60 * 1000;   // 5 min before expiry

  console.log(
    '[TokenManager] setupTokenRefreshTimers at', new Date().toISOString(),
    'expiresAt:', expiresAt, 'now:', now, 't10:', t10, 't5:', t5
  );
console.log('[TokenManager][EXPIRE CHECK] Debug Info:', {
  expiresAt,           // زمانی که توکن باید منقضی شود (ms)
  now,                 // زمان فعلی (ms)
  expiresAt_s: expiresAt / 1000, // نمایش ثانیه‌ای جهت تطبیق با بک‌اند
  now_s: now / 1000,             // نمایش ثانیه‌ای جهت مقایسه راحت‌تر
  delta: expiresAt - now, // اختلاف (ms) (اگر منفی باشد توکن منقضی شده)
  expiresAt_human: new Date(expiresAt).toISOString(),
  now_human: new Date(now).toISOString()
});
  // If token already expired or timers would fire immediately, do not set timers
  if (expiresAt <= now) {
    console.log('[TokenManager] Token already expired! Not setting timers.');
    return;
  }
  if (t10 <= 0 && t5 <= 0) {
    console.log('[TokenManager] Both timers are <= 0. Not setting token timers.');
    return;
  }

  // Set timer for 10 minutes before expiry (if valid)
  if (t10 > 0) {
    tokenTimeout10 = setTimeout(async () => {
      const lastActivity = Number(sessionStorage.getItem('lastActivity'));
      if (Date.now() - lastActivity < 5 * 60 * 1000) {
        await refreshToken();
      }
    }, t10);
  }

  // Set timer for 5 minutes before expiry (if valid)
  if (t5 > 0) {
    tokenTimeout5 = setTimeout(async () => {
      const lastActivity = Number(sessionStorage.getItem('lastActivity'));

      if (Date.now() - lastActivity < 5 * 60 * 1000) {
        await refreshToken();
      } else {
        // Show SweetAlert warning: session will expire in 5 minutes
        Swal.fire({
          icon: 'warning',
          title: 'Session Expiring Soon!',
          text: 'Your session will expire in 5 minutes due to inactivity. Please interact with the page to stay logged in.',
          timer: 6000,
          timerProgressBar: true,
          showConfirmButton: true,
          confirmButtonText: 'OK',
        });

        let activityDetected = false;

        // Handler for user activity during warning period
        expireActivityHandler = () => {
          activityDetected = true;
          sessionStorage.setItem('lastActivity', Date.now().toString());
          removeExpireActivityListeners();
          refreshToken();
          if (expireWarningTimeout) clearTimeout(expireWarningTimeout);
        };

        function addExpireActivityListeners() {
          window.addEventListener('mousemove', expireActivityHandler);
          window.addEventListener('keydown', expireActivityHandler);
        }
        function removeExpireActivityListeners() {
          window.removeEventListener('mousemove', expireActivityHandler);
          window.removeEventListener('keydown', expireActivityHandler);
        }

        // Listen for user activity for the next 5 minutes
        addExpireActivityListeners();

        // After 5 minutes, if no activity, expire the session
        expireWarningTimeout = setTimeout(() => {
          removeExpireActivityListeners();
          if (!activityDetected) {
            clearTokenTimers();
            Swal.fire({
              icon: 'error',
              title: 'Session Expired!',
              text: 'Your session has expired due to inactivity. Please re-enter the note.',
              confirmButtonText: 'Re-enter'
            }).then(() => {
              sessionStorage.clear();
              window.location.reload();
            });
          }
        }, 5 * 60 * 1000);
      }
    }, t5);
  }
}

/**
 * Clears all token-related timers and removes activity listeners.
 * Should be called on logout, note close, or component unmount.
 */
export function clearTokenTimers() {
  if (tokenTimeout10) clearTimeout(tokenTimeout10);
  if (tokenTimeout5) clearTimeout(tokenTimeout5);
  if (expireWarningTimeout) clearTimeout(expireWarningTimeout);
  if (expireActivityHandler) {
    window.removeEventListener('mousemove', expireActivityHandler);
    window.removeEventListener('keydown', expireActivityHandler);
  }
  tokenTimeout10 = null;
  tokenTimeout5 = null;
  expireWarningTimeout = null;
  expireActivityHandler = null;
}

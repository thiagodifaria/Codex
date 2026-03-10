export const DEMO_AUTH_STORAGE_KEY = 'codex_demo_session';

export const DEMO_CREDENTIALS = {
  email: 'email@example.com',
  password: 'test123',
  username: '@test_user',
  displayName: 'Usuario Teste',
} as const;

export interface DemoSession {
  email: string;
  username: string;
  displayName: string;
  provider: 'password' | 'google';
}

export const DEMO_SESSION: DemoSession = {
  email: DEMO_CREDENTIALS.email,
  username: DEMO_CREDENTIALS.username,
  displayName: DEMO_CREDENTIALS.displayName,
  provider: 'password',
};

export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawSession = window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as DemoSession;
  } catch {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    return null;
  }
}

export function setDemoSession(provider: DemoSession['provider']) {
  if (typeof window === 'undefined') {
    return;
  }

  const session: DemoSession = {
    ...DEMO_SESSION,
    provider,
  };

  window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearDemoSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
}

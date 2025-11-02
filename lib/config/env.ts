// lib/config/env.ts

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];

  return value || fallback || '';
};

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5021'),
} as const;

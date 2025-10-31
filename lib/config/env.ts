// lib/config/env.ts

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];

  if (!value && !fallback) {
    console.error(`❌ Variável de ambiente ${key} não está definida`);
    console.log(
      'Available env vars:',
      Object.keys(process.env).filter((k) => k.startsWith('NEXT_PUBLIC_'))
    );
    throw new Error(`Variável de ambiente ${key} não está definida`);
  }

  return value || fallback || '';
};

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5021'),
} as const;

// Log para debug (remover depois)
if (typeof window === 'undefined') {
  console.log('🔍 ENV CHECK (server):', {
    apiUrl: env.apiUrl,
    hasEnv: !!process.env.NEXT_PUBLIC_API_URL,
  });
}

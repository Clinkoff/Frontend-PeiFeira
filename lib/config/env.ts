const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variável de ambiente ${key} não está definida`);
  }

  return value;
};

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL'),
} as const;

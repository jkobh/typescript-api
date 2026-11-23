const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Umgebungsvariable ${name} fehlt`);
  }
  return value;
};

export const env = {
  databaseUrl: required('DATABASE_URL'),
  port: Number(required('PORT')),
  tlsCert: required('TLS_CERT'),
  tlsKey: required('TLS_KEY'),
} as const;

function getCommonConfig() {
  return {
    isDev: process.env.NODE_ENV !== 'production',

    port: parseInt(process.env.APP_PORT ?? '3000', 10),

    s3ClientConfig: {
      endpoint: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'admin',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'secret',
      },
      region: process.env.AWS_REGION ?? 'eu-west-1',
    },
    s3Bucket: process.env.S3_BUCKET_NAME ?? 'bonusx-bucket',

    db: {
      driver: process.env.DB_DRIVER ?? 'postgres',
      url:
        process.env.DATABASE_URL ??
        'postgresql://postgres:password@localhost:5432/bonusx_db',
    },
  };
}

export default getCommonConfig;

function getCommonConfig() {
  return {
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
  };
}

export default getCommonConfig;

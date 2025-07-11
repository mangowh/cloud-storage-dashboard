import getCommonConfig from '@/configs/common';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly s3 = new S3({
    ...getCommonConfig().s3ClientConfig,
    forcePathStyle: true,
  });
  private readonly bucketName = getCommonConfig().s3Bucket;

  constructor() {
    void this.s3.listBuckets().then(async (data) => {
      if (!data.Buckets) {
        throw new Error('Error retrieving buckets. Check configuration');
      }

      if (!data.Buckets.some((bucket) => bucket.Name === this.bucketName)) {
        await this.s3.createBucket({
          Bucket: this.bucketName,
        });

        Logger.log(
          `Bucket ${this.bucketName} not found and created successfully.`,
        );
      }
    });
  }

  async getFiles() {
    return this.s3.listObjects({
      Bucket: this.bucketName,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = file.originalname; // `${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        {
          cause: error,
        },
      );
    }

    return this.getFileUrl(key);
  }

  async getFileUrl(key: string) {
    try {
      const downloadUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        { expiresIn: 3600 }, // 1 hour
      );

      return { downloadUrl };
    } catch (error) {
      throw new InternalServerErrorException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        {
          cause: error,
        },
      );
    }
  }
}

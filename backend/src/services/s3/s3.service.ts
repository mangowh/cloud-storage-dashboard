import getCommonConfig from '@/configs/common';
import { ObjectEntity } from '@/entities/object.entity';
import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
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

  async getObjects() {
    const result = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucketName,
      }),
    );

    const objects = result.Contents || [];

    return Promise.all(
      objects.map(async (obj) => {
        let url: string | undefined;

        if (obj.Key) {
          const fileUrlData = await this.getObjectSignedUrl(obj.Key);
          url = fileUrlData.url;
        }

        return new ObjectEntity({
          key: obj.Key,
          size: obj.Size,
          lastModified: obj.LastModified,
          url,
        });
      }),
    );
  }

  async getObject(key: string) {
    const obj = await this.s3.send(
      new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    const { url } = await this.getObjectSignedUrl(key);

    return new ObjectEntity({
      key: key,
      size: obj.ContentLength,
      lastModified: obj.LastModified,
      url,
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

      const obj = await this.getObject(key);

      return obj;
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

  async getObjectSignedUrl(key: string) {
    try {
      const url = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        { expiresIn: 3600 }, // 1 hour
      );

      return { url };
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

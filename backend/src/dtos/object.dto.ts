import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetObjectDto {
  @ApiProperty({ example: 'photos/profile.png' })
  @Expose()
  key: string;
}

export class ObjectDto {
  @ApiProperty({ example: 'photos/profile.png' })
  @Expose()
  key: string;

  @ApiProperty({
    example: 204800,
    description: 'Size in bytes',
  })
  @Expose()
  size: number;

  @ApiProperty({
    example: '2025-07-13T12:34:56.000Z',
    description: 'Last modification timestamp',
  })
  @Expose()
  lastModified: Date;

  @ApiProperty({
    example: 'https://bucket.s3.eu-central-1.amazonaws.com/photos/profile.png',
    description: 'Signed or public URL',
  })
  @Expose()
  url: string;
}

export class ObjectUrlDto {
  @ApiProperty({
    example:
      'https://bucket.s3.eu-central-1.amazonaws.com/photos/profile.png?X-Amz-Signature=...',
    description: 'Presigned URL for direct access',
  })
  @Expose()
  url: string;
}

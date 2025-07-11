import { S3Service } from '@/services/s3/s3.service';
import { Mapper } from '@/utils/mapper/mapper';
import { Mocked, TestBed } from '@suites/unit';
import { S3Controller } from './s3.controller';

describe('S3Controller', () => {
  let s3Controller: S3Controller;
  let s3Service: Mocked<S3Service>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(S3Controller).compile();

    s3Controller = unit;
    s3Service = unitRef.get(S3Service);

    jest.spyOn(Mapper, 'mapData').mockImplementation();
  });

  it('should be defined', () => {
    expect(s3Controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(s3Service).toBeDefined();
  });
});

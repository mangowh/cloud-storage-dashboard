import { Expose } from 'class-transformer';

export interface IGetObjectDto {
  key: string;
}

export class GetObjectDto implements IGetObjectDto {
  @Expose()
  key: string;
}

export interface IObjectDto {
  key: string;
  size?: number;
  lastModified?: Date;
  url?: string;
}

export class ObjectDto implements IObjectDto {
  @Expose()
  key: string;

  @Expose()
  size?: number;

  @Expose()
  lastModified?: Date;

  @Expose()
  url?: string;
}

export interface IObjectUrlDto {
  url?: string;
}

export class ObjectUrlDto implements IObjectUrlDto {
  @Expose()
  url?: string;
}

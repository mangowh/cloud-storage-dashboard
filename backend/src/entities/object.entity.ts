import { Expose } from 'class-transformer';

export interface IObjectEntity {
  key: string;
  size?: number;
  lastModified?: Date;
  url?: string;
}

export class ObjectEntity implements IObjectEntity {
  @Expose()
  key: string;

  @Expose()
  size?: number;

  @Expose()
  lastModified?: Date;

  @Expose()
  url?: string;

  constructor(partial: Partial<ObjectEntity>) {
    Object.assign(this, partial);
  }
}

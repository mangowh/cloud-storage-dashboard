import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export interface ICollection<T> {
  items: T[];
}

export function createCollectionDto<TItem>(ItemDto: new () => TItem) {
  class CollectionDto implements ICollection<TItem> {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    @ApiProperty({ type: ItemDto, isArray: true })
    @Expose()
    items: TItem[];

    constructor(items: TItem[]) {
      this.items = items;
    }
  }

  Object.defineProperty(CollectionDto, 'name', {
    value: `CollectionOf${ItemDto.name}`,
  });

  return CollectionDto;
}

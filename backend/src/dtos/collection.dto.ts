import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export function createCollectionDto<TItem>(ItemDto: new () => TItem) {
  class CollectionDto {
    @ApiProperty({ type: ItemDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
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

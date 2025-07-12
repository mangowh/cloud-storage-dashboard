import { createCollectionDto } from '@/dtos/collection.dto';
import { GetObjectDto, ObjectDto, ObjectUrlDto } from '@/dtos/object.dto';
import { S3Service } from '@/services/s3/s3.service';
import { Mapper } from '@/utils/mapper/mapper';
import {
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of files in the bucket',
    type: createCollectionDto(ObjectDto),
  })
  async getObjects() {
    const objs = await this.s3Service.getObjects();

    const dtos = objs.map((obj) => Mapper.mapData(ObjectDto, obj));

    return dtos;
  }

  @Get(':key')
  @ApiResponse({
    status: 200,
    description: 'File details',
    type: ObjectDto,
  })
  async getObject(@Param() { key }: GetObjectDto) {
    const obj = await this.s3Service.getObject(key);

    const dto = Mapper.mapData(ObjectDto, obj);

    return dto;
  }

  @Post()
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: ObjectUrlDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 })], // 100 MB
      }),
    )
    file: Express.Multer.File,
  ) {
    const { url } = await this.s3Service.uploadFile(file);

    const dto = Mapper.mapData(ObjectUrlDto, { url });

    return dto;
  }
}

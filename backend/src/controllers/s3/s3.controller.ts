import { createCollectionDto } from '@/dtos/collection.dto';
import { GetObjectDto, ObjectDto } from '@/dtos/object.dto';
import { S3Service } from '@/services/s3/s3.service';
import { Mapper } from '@/utils/mapper/mapper';
import {
  Controller,
  Get,
  HttpStatus,
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
  constructor(private readonly s3Service: S3Service) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
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
    status: HttpStatus.OK,
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
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully',
    type: ObjectDto,
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
    const obj = await this.s3Service.uploadFile(file);

    const dto = Mapper.mapData(ObjectDto, obj);

    return dto;
  }
}

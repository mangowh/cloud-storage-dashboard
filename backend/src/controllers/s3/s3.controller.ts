import { createCollectionDto } from '@/dtos/collection.dto';
import { GetObjectDto, ObjectDto } from '@/dtos/object.dto';
import { AuthGuard } from '@/guards/auth.guard';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('s3')
@ApiBearerAuth()
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get()
  @ApiOperation({
    summary: 'List all files in the bucket',
    operationId: 'getObjects',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: createCollectionDto(ObjectDto),
    description: 'List of files',
  })
  async getObjects() {
    const objs = await this.s3Service.getObjects();

    const mappedObjs = objs.map((obj) => Mapper.mapData(ObjectDto, obj));

    // order by lastModified DESC
    const sortedObjs = mappedObjs.sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime(),
    );

    const CollectionDto = createCollectionDto(ObjectDto);
    return new CollectionDto(sortedObjs);
  }

  @Get(':key')
  @ApiOperation({
    summary: 'Get details of a file by key',
    operationId: 'getObject',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ObjectDto })
  async getObject(@Param() { key }: GetObjectDto) {
    const obj = await this.s3Service.getObject(key);
    return Mapper.mapData(ObjectDto, obj);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a file',
    operationId: 'uploadFile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ObjectDto,
    description: 'File uploaded successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or missing file',
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10 MB
      }),
    )
    file: Express.Multer.File,
  ) {
    const obj = await this.s3Service.uploadFile(file);
    return Mapper.mapData(ObjectDto, obj);
  }
}

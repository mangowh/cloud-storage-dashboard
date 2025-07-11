import { S3Service } from '@/services/s3/s3.service';
import {
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of files in the bucket',
    // type: FileEntity,
  })
  getFiles() {
    return this.s3Service.getFiles();
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
    // type: FileEntity, // TODO aggiustare tipo
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 })], // 100 MB
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.s3Service.uploadFile(file); // TODO use file DTO
  }
}

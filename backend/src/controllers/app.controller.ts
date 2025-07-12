import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IMessageDto, MessageDto } from '../dtos/message.dto';
import { AppService } from '../services/app/app.service';
import { Mapper } from '../utils/mapper/mapper';

@ApiTags('hello')
@Controller('hello')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a hello message',
    description: `Returns a greeting message. It’s like saying "I'm Pickle Rick!" but... less green.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved hello message',
    type: MessageDto,
  })
  getHello(): IMessageDto {
    const entity = this.appService.getHello();
    return Mapper.mapData(MessageDto, entity);
  }
}

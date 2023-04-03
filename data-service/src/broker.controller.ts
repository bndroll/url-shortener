import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUrlContract } from './url/dto/contracts/create-url.contract';
import { UrlService } from './url/url.service';
import { UrlMapper } from './url/dto/mappers/url.mapper';
import { UpdateUrlConnectionContract } from './url/dto/contracts/update-url-connection.contract';

@Controller()
export class BrokerController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlMapper: UrlMapper,
  ) {
  }

  @MessagePattern(CreateUrlContract.topic)
  async createShortUrl(@Payload() message: CreateUrlContract.Request): Promise<CreateUrlContract.Response> {
    const url = await this.urlService.createShortUrl({ id: message.id, ip: message.ip, url: message.url });
    return this.urlMapper.map(url);
  }

  @MessagePattern(UpdateUrlConnectionContract.topic)
  async updateConnection(@Payload() message: UpdateUrlConnectionContract.Request): Promise<void> {
    await this.urlService.updateConnection(message);
  }
}
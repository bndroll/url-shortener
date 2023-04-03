import { Body, Controller, Get, Inject, Ip, Param, Post } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { v4 as uuid } from 'uuid';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { CreateUrlContract } from './dto/contracts/create-url.contract';
import { PublicFindUrlDetailsDto, PublicFindUrlDto } from './dto/find-url.dto';
import { UrlService } from './url.service';
import { UrlMapper } from './dto/mappers/url.mapper';

@Controller('url')
export class UrlController {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly producer: Producer,
    private readonly urlService: UrlService,
    private readonly urlMapper: UrlMapper,
  ) {
  }

  @Post('shorten')
  async shortenUrl(@Body() { url }: ShortenUrlDto, @Ip() ip: string): Promise<{ id: string }> {
    const id = uuid();
    const message: CreateUrlContract.Request = { id, ip, url };
    await this.producer.send({
      topic: CreateUrlContract.topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    return { id };
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Ip() ip: string): Promise<PublicFindUrlDto> {
    const url = await this.urlService.findById(id, ip);
    return this.urlMapper.map(url);
  }

  @Get(':id/details')
  async findDetails(@Param('id') id: string, @Ip() ip: string): Promise<PublicFindUrlDetailsDto> {
    const url = await this.urlService.findDetails(id, ip);
    return this.urlMapper.map(url);
  }
}

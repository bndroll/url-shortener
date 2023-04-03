import { Controller, Get, Param } from '@nestjs/common';
import { UrlService } from './url/url.service';
import { UrlMapper } from './url/dto/mappers/url.mapper';
import { PublicFindUrlDetailsDto, PublicFindUrlDto } from './url/dto/find-url.dto';

@Controller()
export class AppController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlMapper: UrlMapper,
  ) {
  }

  @Get(':shortUrl')
  async findByShortUrl(@Param('shortUrl') shortUrl: string): Promise<PublicFindUrlDto> {
    const url = await this.urlService.findByShortUrl(shortUrl);
    return this.urlMapper.map(url);
  }

  @Get(':urlId/part')
  async findById(@Param('urlId') id: string): Promise<PublicFindUrlDto> {
    const url = await this.urlService.findById(id);
    return this.urlMapper.map(url);
  }

  @Get(':urlId/details')
  async findDetails(@Param('urlId') urlId: string): Promise<PublicFindUrlDetailsDto> {
    return await this.urlService.findDetails(urlId);
  }
}
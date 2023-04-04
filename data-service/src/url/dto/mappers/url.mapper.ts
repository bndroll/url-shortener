import { Injectable } from '@nestjs/common';
import { Url } from '../../entity/url.entity';
import { PublicFindUrlDto } from '../find-url.dto';

@Injectable()
export class UrlMapper {
  map(url: Url): PublicFindUrlDto {
    return {
      id: url.id,
      ip: url.ip,
      destination: url.destination,
      shortUrl: url.shortUrl,
    };
  }

  mapAll(urls: Url[]): PublicFindUrlDto[] {
    return urls.map(item => ({
      id: item.id,
      ip: item.ip,
      destination: item.destination,
      shortUrl: item.shortUrl,
    }))
  }
}
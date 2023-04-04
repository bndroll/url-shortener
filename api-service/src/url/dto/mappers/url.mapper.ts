import { Injectable } from '@nestjs/common';
import { BackendUrlGeneratorService } from '../../../common/url/backend-url-generator.module';

@Injectable()
export class UrlMapper {
  constructor(
    private readonly backendUrlGeneratorService: BackendUrlGeneratorService,
  ) {
  }

  map<T extends { shortUrl: string }>(url: T): T {
    return {
      ...url,
      shortUrl: this.backendUrlGeneratorService.build(url.shortUrl),
    };
  }

  mapAll<T extends { shortUrl: string }>(urls: T[]): T[] {
    return urls.map(item => ({
      ...item,
      shortUrl: this.backendUrlGeneratorService.build(item.shortUrl),
    }));
  }
}
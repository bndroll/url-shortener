import { Injectable } from '@nestjs/common';
import { BackendUrlGeneratorService } from '../../../common/url/backend-url-generator.module';

@Injectable()
export class UrlMapper {
  constructor(
    private readonly backendUrlGeneratorService: BackendUrlGeneratorService,
  ) {
  }

  map<T extends { shortUrl: string }>(dto: T): T {
    return {
      ...dto,
      shortUrl: this.backendUrlGeneratorService.build(dto.shortUrl),
    };
  }
}
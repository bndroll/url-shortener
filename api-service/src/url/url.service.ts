import { BadRequestException, Injectable } from '@nestjs/common';
import { UrlMemoryStorageRepository } from './repository/url-memory-storage.repository';
import { UrlErrorMessages } from './url.constants';
import { UrlHttpService } from './url-http.service';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlMemoryStorageRepository: UrlMemoryStorageRepository,
    private readonly urlHttpService: UrlHttpService,
  ) {
  }

  async findLongUrl(shortUrl: string) {
    const cachedUrl = await this.urlMemoryStorageRepository.get(shortUrl);
    if (cachedUrl) {
      return cachedUrl;
    }

    const url = (await this.urlHttpService.requestLongUrl(shortUrl)).destination;
    if (!url) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    return url;
  }

  async findById(id: string, ip) {
    const url = await this.urlHttpService.requestFindUrl(id);
    if (!url && ip !== url.ip) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    return url;
  }

  async findDetails(id: string, ip) {
    const url = await this.urlHttpService.requestFindUrlDetails(id);
    if (!url && ip !== url.ip) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    return url;
  }
}
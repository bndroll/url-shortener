import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUrlContract } from './dto/contracts/create-url.contract';
import { UrlMemoryStorageRepository } from './repository/url-memory-storage.repository';
import { UrlRepository } from './repository/url.repository';
import { UrlGenerateService } from './url-generate.service';
import { UrlMetricsRepository } from './repository/url-metrics.repository';
import { UrlErrorMessages } from './url.constants';
import { UpdateUrlConnectionContract } from './dto/contracts/update-url-connection.contract';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlMemoryStorageRepository: UrlMemoryStorageRepository,
    private readonly urlGenerateService: UrlGenerateService,
    private readonly urlMetricsRepository: UrlMetricsRepository,
  ) {
  }

  async createShortUrl({ id, ip, url }: CreateUrlContract.Request) {
    const oldUrl = await this.urlRepository.findUniqueForUser({ ip: ip, destination: url });
    if (oldUrl) {
      const redisShortUrl = await this.urlMemoryStorageRepository.get(oldUrl.shortUrl);
      if (!redisShortUrl) {
        await this.urlMemoryStorageRepository.insert(oldUrl.shortUrl, oldUrl.destination);
      }

      return oldUrl;
    }

    const savedUrl = await this.urlGenerateService.generateAndSaveShortUrl({ id, ip: ip, destination: url });
    await this.urlMetricsRepository.create(savedUrl.id);
    await this.urlMemoryStorageRepository.insert(savedUrl.shortUrl, savedUrl.destination);
    return savedUrl;
  }

  async findByShortUrl(shortUrl: string) {
    const oldUrl = await this.urlRepository.findByShortUrl(shortUrl);
    if (!oldUrl) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    const redisShortUrl = await this.urlMemoryStorageRepository.get(oldUrl.shortUrl);
    if (!redisShortUrl) {
      await this.urlMemoryStorageRepository.insert(oldUrl.shortUrl, oldUrl.destination);
    }

    return oldUrl;
  }

  async findById(id: string) {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    return url;
  }

  async findDetails(urlId: string) {
    const url = await this.urlRepository.findDetails(urlId);
    if (!url) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    return url;
  }

  async updateConnection({ shortUrl, ip, date }: UpdateUrlConnectionContract.Request) {
    const url = await this.urlRepository.findByShortUrl(shortUrl);
    if (!url) {
      throw new BadRequestException(UrlErrorMessages.NotFound);
    }

    await this.urlMetricsRepository.appendConnection({ urlId: url.id, ip: ip, date: date });
  }
}
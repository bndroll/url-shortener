import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UrlMemoryStorageRepository } from '../repository/url-memory-storage.repository';
import { UrlRepository } from '../repository/url.repository';
import { UrlMetricsRepository } from '../repository/url-metrics.repository';

@Injectable()
export class UrlCronService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlMetricsRepository: UrlMetricsRepository,
    private readonly urlMemoryStorageRepository: UrlMemoryStorageRepository,
  ) {
  }

  @Cron('0 0 4 * * *')
  async deleteOldUrls() {
    console.log('cron');
    const { ids, shortUrls } = await this.urlRepository.deleteOldUrls();
    console.log('cron job ids = ', ids);
    console.log('cron job shortUrls = ', shortUrls);
    await this.urlMetricsRepository.deleteOldMetrics(ids);
    await this.urlMemoryStorageRepository.deleteOldCache(shortUrls);
  }
}
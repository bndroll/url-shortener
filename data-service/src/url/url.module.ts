import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './entity/url.entity';
import { UrlMetrics, UrlMetricsSchema } from './entity/url-metrics.entity';
import { UrlService } from './url.service';
import { UrlMapper } from './dto/mappers/url.mapper';
import { UrlMemoryStorageRepository } from './repository/url-memory-storage.repository';
import { UrlRepository } from './repository/url.repository';
import { UrlGenerateService } from './url-generate.service';
import { UrlMetricsRepository } from './repository/url-metrics.repository';
import { UrlCronService } from './cron/url-cron.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Url.name, schema: UrlSchema },
      { name: UrlMetrics.name, schema: UrlMetricsSchema },
    ]),
  ],
  providers: [
    UrlService,
    UrlGenerateService,
    UrlMapper,
    UrlRepository,
    UrlMemoryStorageRepository,
    UrlMetricsRepository,
    UrlCronService,
  ],
  exports: [UrlService, UrlMapper],
})
export class UrlModule {
}
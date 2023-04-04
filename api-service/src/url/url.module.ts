import { forwardRef, Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlMemoryStorageRepository } from './repository/url-memory-storage.repository';
import { UrlService } from './url.service';
import { HttpModule } from '@nestjs/axios';
import { RedirectController } from './redirect.controller';
import { UrlHttpService } from './url-http.service';
import { BackendUrlGeneratorModule } from '../common/url/backend-url-generator.module';
import { UrlMapper } from './dto/mappers/url.mapper';
import { AppModule } from '../app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    HttpModule,
    BackendUrlGeneratorModule,
  ],
  controllers: [UrlController, RedirectController],
  providers: [
    UrlMemoryStorageRepository,
    UrlService,
    UrlHttpService,
    UrlMapper,
  ],
})
export class UrlModule {
}

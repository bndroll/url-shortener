import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { UrlController } from './url.controller';
import { UrlMemoryStorageRepository } from './repository/url-memory-storage.repository';
import { UrlService } from './url.service';
import { HttpModule } from '@nestjs/axios';
import { RedirectController } from './redirect.controller';
import { UrlHttpService } from './url-http.service';
import { BackendUrlGeneratorModule } from '../common/url/backend-url-generator.module';
import { UrlMapper } from './dto/mappers/url.mapper';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'url-shortener',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: `url-shortener-producer`,
          },
        },
      },
    ]),
    HttpModule,
    BackendUrlGeneratorModule,
  ],
  controllers: [UrlController, RedirectController],
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (client: ClientKafka) => {
        return client.connect();
      },
      inject: ['API_SERVICE'],
    },
    UrlMemoryStorageRepository,
    UrlService,
    UrlHttpService,
    UrlMapper,
  ],
})
export class UrlModule {
}

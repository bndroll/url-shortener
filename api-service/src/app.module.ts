import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BackendUrlGeneratorModule } from './common/url/backend-url-generator.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerProvider } from './common/kafka/providers/kafka-producer.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
      isGlobal: true,
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'url-shortener',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
        },
      },
    ]),
    UrlModule,
    BackendUrlGeneratorModule,
  ],
  providers: [KafkaProducerProvider],
  exports: [KafkaProducerProvider],
})
export class AppModule {
}

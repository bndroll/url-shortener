import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerController } from './broker.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { UrlModule } from './url/url.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { getMongoConfig } from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ScheduleModule.forRoot(),
    UrlModule,
  ],
  controllers: [BrokerController, AppController],
})
export class AppModule {
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';
import { BrokerController } from './broker.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { UrlModule } from './url/url.module';
import { HashingModule } from './hashing/hashing.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env'
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    UrlModule,
    HashingModule
  ],
  controllers: [BrokerController, AppController],
})
export class AppModule {
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BackendUrlGeneratorModule } from './common/url/backend-url-generator.module';

export const getHost = () => {
  console.log(process.env.REDIS_HOST);
  return process.env.REDIS_HOST;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env'
    }),
    RedisModule.forRoot({
      config: {
        host: getHost(),
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    UrlModule,
    BackendUrlGeneratorModule,
  ],
})
export class AppModule {
}

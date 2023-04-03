import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class BackendUrlGeneratorService {
  constructor(private host: string) {
  }

  build(path: string) {
    return this.host + path;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BackendUrlGeneratorService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => new BackendUrlGeneratorService(configService.get('BACKEND_URL')),
    },
  ],
  exports: [BackendUrlGeneratorService],
})
export class BackendUrlGeneratorModule {
}

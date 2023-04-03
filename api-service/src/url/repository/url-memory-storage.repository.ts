import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlMemoryStorageRepository {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
  }

  async get(shortUrl: string): Promise<string | undefined> {
    return this.redis.get(this.getKey(shortUrl));
  }

  private getKey(shortUrl: string): string {
    return `${this.configService.get('REDIS_KEY')}-${shortUrl}`;
  }
}
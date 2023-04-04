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

  async insert(shortUrl: string, destination: string) {
    await this.redis.set(this.getKey(shortUrl), destination, 'EX', 3600);
  }

  async get(shortUrl: string): Promise<string | undefined> {
    return this.redis.get(this.getKey(shortUrl));
  }

  async deleteOldCache(shortUrls: string[]) {
    for (const url of shortUrls) {
      await this.redis.del(this.getKey(url));
    }
  }

  private getKey(shortUrl: string): string {
    return `${this.configService.get('REDIS_KEY')}-${shortUrl}`;
  }
}
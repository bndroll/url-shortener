import { BadRequestException, Injectable } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { UrlRepository } from './repository/url.repository';
import { UrlIdentifierDto } from './dto/url-identifier.dto';
import { Url } from './entity/url.entity';

@Injectable()
export class UrlGenerateService {
  private readonly shortUrlLength: number;
  private readonly charset = '01234567879abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly urlRepository: UrlRepository,
  ) {
    this.shortUrlLength = this.configService.get('SHORT_URL_LENGTH');
  }

  private async generateHash(destination: string) {
    return await this.hashingService.hash(destination);
  }

  private generateRandomString() {
    let randomString = '';
    while (randomString.length < this.shortUrlLength) {
      const randomIndex = Math.floor(Math.random() * this.charset.length + 1);
      randomString += this.charset.charAt(randomIndex);
    }
    return randomString;
  }

  async generateAndSaveShortUrl({ id, destination, ip }: UrlIdentifierDto, attempts = 0): Promise<Url> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = await this.urlRepository.create({
          id: id,
          ip: ip,
          destination: destination,
          shortUrl: this.generateRandomString(),
        });
        return resolve(url);
      } catch (e) {
        if (e.code === 11000 && attempts < this.configService.get('MAX_ATTEMPTS_COUNT')) {
          try {
            const url = await this.generateAndSaveShortUrl({ id, destination, ip }, attempts + 1);
            return resolve(url);
          } catch (e) {
            return reject(e);
          }
        }

        return reject(new BadRequestException());
      }
    });
  }
}
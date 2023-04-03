import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PublicFindUrlDetailsDto, PublicFindUrlDto } from './dto/find-url.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
  }

  async requestLongUrl(shortUrl: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<PublicFindUrlDto>(`${this.configService.get('DATA_SERVICE_URL')}/${shortUrl}`),
    );
    return data;
  }

  async requestFindUrl(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<PublicFindUrlDto>(`${this.configService.get('DATA_SERVICE_URL')}/${id}/part`),
    );
    return data;
  }

  async requestFindUrlDetails(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<PublicFindUrlDetailsDto>(`${this.configService.get('DATA_SERVICE_URL')}/${id}/details`),
    );
    return data;
  }
}
import { Controller, Get, Inject, Ip, Param, Res } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { Response } from 'express';
import { UrlService } from './url.service';
import { UpdateUrlConnectionContract } from './dto/contracts/update-url-connection.contract';

@Controller()
export class RedirectController {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly producer: Producer,
    private readonly urlService: UrlService,
  ) {
  }

  @Get(':shortUrl')
  async redirectToUrl(@Param('shortUrl') shortUrl: string, @Ip() ip: string, @Res() res: Response) {
    const redirectedUrl = await this.urlService.findLongUrl(shortUrl);
    const message: UpdateUrlConnectionContract.Request = { ip: ip, shortUrl: shortUrl, date: new Date() };
    await this.producer.send({
      topic: UpdateUrlConnectionContract.topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    res.redirect(301, redirectedUrl);
  }
}

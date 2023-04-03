import { IsDate, IsString } from 'class-validator';

export namespace UpdateUrlConnectionContract {
  export const topic = 'url-connection.update.event';

  export class Request {
    @IsString()
    ip: string;

    @IsString()
    shortUrl: string;

    @IsDate()
    date: Date;
  }
}
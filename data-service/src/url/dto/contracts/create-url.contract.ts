import { IsString } from 'class-validator';

export namespace CreateUrlContract {
  export const topic = 'url.create.command';

  export class Request {
    @IsString()
    id: string;

    @IsString()
    url: string;

    @IsString()
    ip: string;
  }

  export class Response {
    id: string;
    destination: string;
    shortUrl: string;
  }
}
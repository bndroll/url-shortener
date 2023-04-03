export class UrlConnection {
  ip: string;
  date: Date;
}

export class PublicFindUrlDetailsDto {
  id: string;
  destination: string;
  shortUrl: string;
  ip: string;
  createdDate: Date;
  metrics: {
    lastConnectionDate: Date;
    connections: UrlConnection[];
  };
}

export class PublicFindUrlDto {
  id: string;
  ip: string;
  destination: string;
  shortUrl: string;
}
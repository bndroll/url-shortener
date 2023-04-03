import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlMetrics } from '../entity/url-metrics.entity';
import { AppendConnectionDto } from '../dto/append-connection.dto';

@Injectable()
export class UrlMetricsRepository {
  constructor(
    @InjectModel(UrlMetrics.name) private readonly urlMetricsModel: Model<UrlMetrics>,
  ) {
  }

  async create(urlId: string) {
    const savedUrl = await new this.urlMetricsModel({
      urlId: urlId,
      connections: [],
    });
    return await savedUrl.save();
  }

  async appendConnection({ urlId, ip, date }: AppendConnectionDto) {
    const metrics = await this.urlMetricsModel.findOne({ urlId: urlId }).exec();
    metrics.lastConnectionDate = date;
    metrics.connections.push({ ip, date });
    await metrics.save();
  }

  async deleteOldMetrics(ids: string[]) {
    await this.urlMetricsModel.deleteMany({ urlId: { $in: ids } });
  }
}
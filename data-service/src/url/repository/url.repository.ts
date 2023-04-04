import { Injectable } from '@nestjs/common';
import { UrlIdentifierDto } from '../dto/url-identifier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../entity/url.entity';
import { Model } from 'mongoose';
import { CreateUrlEntityDto } from '../dto/create-url-entity.dto';
import { PublicFindUrlDetailsDto } from '../dto/find-url.dto';

@Injectable()
export class UrlRepository {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
  ) {
  }

  async create({ id, destination, ip, shortUrl }: CreateUrlEntityDto) {
    const savedUrl = await new this.urlModel({
      id: id,
      destination: destination,
      ip: ip,
      shortUrl: shortUrl,
      createdDate: new Date(),
    });
    return await savedUrl.save();
  }

  async findUniqueForUser({ destination, ip }: Omit<UrlIdentifierDto, 'id'>) {
    return await this.urlModel.findOne({ destination, ip }).exec();
  }

  async findAll(ip: string) {
    return await this.urlModel.find({ ip }).exec();
  }

  async findByShortUrl(shortUrl: string) {
    return await this.urlModel.findOne({ shortUrl }).exec();
  }

  async findById(id: string) {
    return await this.urlModel.findOne({ id }).exec();
  }

  async findDetails(urlId: string): Promise<PublicFindUrlDetailsDto> {
    return (await this.urlModel.aggregate([
      { $match: { id: urlId } },
      {
        $lookup: {
          from: 'urlmetrics',
          localField: 'id',
          foreignField: 'urlId',
          as: 'metrics',
        },
      },
      { $unwind: '$metrics' },
      { $addFields: { 'metrics.connectionsCount': { $size: '$metrics.connections' } } },
      { $unset: ['_id', '__v', 'metrics._id', 'metrics.__v', 'metrics.urlId'] },
    ]).exec())[0];
  }

  async deleteOldUrls() {
    const result: { ids: string[], shortUrls: string[] } = {
      ids: [],
      shortUrls: [],
    };

    const urls = (await this.urlModel.aggregate([
      {
        $match: {
          'createdDate': {
            '$lt': new Date(Date.now() + 1000 * 3600 * 24 * 7),
          },
        },
      },
    ]).exec());
    urls.forEach(item => result.ids.push(item.id));
    urls.forEach(item => result.shortUrls.push(item.shortUrl));

    await this.urlModel.deleteMany({ id: { $in: result.ids } });

    return result;
  }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class UrlConnection {
  ip: string;
  date: Date;
}

@Schema()
export class UrlMetrics {
  @Prop({ required: true, unique: true })
  urlId: string;

  @Prop()
  lastConnectionDate: Date;

  @Prop([UrlConnection])
  connections: UrlConnection[];
}

export const UrlMetricsSchema = SchemaFactory.createForClass(UrlMetrics);

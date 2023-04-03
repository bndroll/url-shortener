import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Url {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, unique: true })
  shortUrl: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
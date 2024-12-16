import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportResponseDto } from '../dto/report-response.dto';

@Schema()
export class Report extends Document {
  @Prop({ required: true })
  reporterId: Types.ObjectId; // denunciador

  @Prop({ required: true })
  reporterName: string;

  @Prop({ required: true })
  reporterSex: string;

  @Prop({ required: true })
  accusedId: Types.ObjectId; // denunciado

  @Prop()
  content: string; // motivo da denúncia

  @Prop()
  comment?: string; // comentário opcional

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.methods.toDTO = function (): ReportResponseDto {
  return {
    reporterId: this.reporterId,
    reporterName: this.reporterName,
    reporterSex: this.reporterSex,
    accusedId: this.accusedId,
    content: this.content,
    comment: this.comment,
    createdAt: this.createdAt,
    reportId: this._id,
  };
};

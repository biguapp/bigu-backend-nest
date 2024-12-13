import { Document } from 'mongoose';
import { ReportResponseDto } from '../dto/report-response.dto';

export interface Report extends Document {
  readonly rideId: string;
  readonly reporterId: string;   // denunciador
  readonly reporterName: string;
  readonly accusedId: string;    // denunciado
  readonly content: string;      // motivo da denúncia
  readonly comment?: string;     // comentário opcional
  readonly createdAt: Date;

  toDTO(): ReportResponseDto;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../enums/enum';
import { Document, Types } from 'mongoose';
import { UserResponseDto } from '../dto/response-user.dto';

@Schema()
export class User extends Document {
  @Prop({ type: Buffer })
  profileImage?: Buffer;

  @Prop({ type: Buffer })
  idPhoto?: Buffer;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sex: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  matricula: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role.User;

  @Prop([String])
  feedbacks?: string[];

  @Prop({ default: 5 })
  avgScore: number;

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop({ default: 0 })
  readonly offeredRidesCount?: number;

  @Prop({ default: 0 })
  readonly takenRidesCount?: number;

  @Prop({ required: true })
  verificationCode: string;

  @Prop( { required: true, default: false})
  isVerified: boolean;

  @Prop({required: false, type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  documentStatus: 'pending' | 'approved' | 'rejected';

  @Prop({ required: false })
  verificationReason?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Report' }] })
  reports?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toDTO = function (): UserResponseDto {
  return {
    profileImage: this.profileImage ? this.profileImage.toString('base64') : null,
    userId: this.id,
    name: this.name,
    email: this.email,
    sex: this.sex,
    phoneNumber: this.phoneNumber,
    matricula: this.matricula,
    feedbacks: this.feedbacks,
    avgScore: this.avgScore,
    ratingCount: this.ratingCount,
    offeredRidesCount: this.offeredRidesCount,
    takenRidesCount: this.takenRidesCount,
    isVerified: this.isVerified,
    documentStatus: this.documentStatus, 
    verificationReason: this.verificationReason,  
    reports: this.reports,
  };

};

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../enums/enum';
import { Document } from 'mongoose';
import { UserResponseDto } from '../dto/response-user.dto';

@Schema()
export class User extends Document {

  @Prop( { type: Buffer })
  profileImage?: Buffer;

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

  @Prop({ default: 0 })
  avgScore: number;

  @Prop({ required: true })
  verificationCode: string;

  @Prop( { required: true, default: false})
  isVerified: boolean;
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
    isVerified: this.isVerified
  };
};

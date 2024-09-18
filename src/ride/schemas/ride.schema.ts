import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RideResponseDto } from '../dto/response-ride.dto';
import { Candidate, CandidateSchema } from './candidate.schema';
import { CANCELLED } from 'dns';

@Schema()
export class Ride extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  members?: Types.ObjectId[];

  @Prop({ type: [Candidate], ref: 'User' })
  candidates?: Candidate[];

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  startAddress: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  destinationAddress: Types.ObjectId;

  @Prop({ required: true })
  numSeats: number;

  @Prop({ required: true })
  goingToCollege: boolean;

  @Prop({ required: true })
  price: number;

  @Prop()
  scheduledTime: Date;

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop({ required: true })
  toWomen: boolean;

  @Prop({ required: true })
  isOver: boolean;
}

export const RideSchema = SchemaFactory.createForClass(Ride);

RideSchema.methods.toDTO = async function (): Promise<RideResponseDto> {
  const driver = await (this.model('User').findById(this.driver));
  const members = await Promise.all(
    (this.members || []).map(memberId => this.model('User').findById(memberId).exec())
  );
  const canditates = await Promise.all(
    this.candidates.map(async candidate => {
      const [user, address] = await Promise.all([
        this.model('User').findById(candidate.user).exec(),
        this.model('Address').findById(candidate.address).exec()
      ]);

      return {
        user: user ? user.toDTO() : null, // Certifique-se de que toDTO está definido em User
        address: address ? address.toDTO() : null // Certifique-se de que toDTO está definido em Address
      };
    })
  );
  const startAddress = await this.model('Address').findById(this.startAddress).exec();
  const destinationAddress = await this.model('Address').findById(this.destinationAddress).exec();
  const car = await this.model('Car').findById(this.car).exec();

  return {
    driver: driver.toDTO(),
    members: members.map(member => member.toDTO()),
    candidates: canditates,
    startAddress: startAddress.toDTO(),
    destinationAddress: destinationAddress.toDTO(),
    numSeats: this.numSeats,
    goingToCollege: this.goingToCollege,
    price: this.price,
    scheduledTime: this.scheduledTime.toISOString(),
    car: car.toDTO(),
    description: this.description,
    toWomen: this.toWomen,
    isOver: this.isOver,
  };
};

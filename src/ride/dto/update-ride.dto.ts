import { PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-ride.dto';

export class UpdateRideDto extends PartialType(CreateRideDto){
  
}

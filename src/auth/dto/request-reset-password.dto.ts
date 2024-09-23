import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  }
  
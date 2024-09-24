import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    readonly password: string;
  }
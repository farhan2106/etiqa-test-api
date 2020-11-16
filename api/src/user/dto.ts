import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('ms-MY')
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  skillsets: string

  @IsOptional()
  hobby: string
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber('ms-MY')
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  skillsets: string

  @IsOptional()
  hobby: string
}

export class DeleteUserDto {
  @IsOptional()
  selector: number | string;
}

export class GetUserDto {
  @IsOptional()
  selector: string;
}

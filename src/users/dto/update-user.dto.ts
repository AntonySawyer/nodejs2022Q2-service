import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  newPassword: string;
}

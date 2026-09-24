import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeliveryConfirmationDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  photos: string[];
}

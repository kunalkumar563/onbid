import { IsDateString } from 'class-validator';

export class ScheduleVerificationDto {
  @IsDateString()
  scheduledAt: string;
}

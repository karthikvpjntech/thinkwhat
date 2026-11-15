import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
export class TriggerAlertDto {
  @IsString() shopId: string;          // geofence identifier = shop id
  @IsOptional() @IsLatitude() lat?: number;
  @IsOptional() @IsLongitude() lng?: number;
}

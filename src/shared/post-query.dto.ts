import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from './query.dto';

export class PostQueryDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  label: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  q: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  path: string;
}

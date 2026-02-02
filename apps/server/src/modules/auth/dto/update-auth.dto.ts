import { PartialType } from '@nestjs/swagger';
import { ReqAuthDto } from './req-auth.dto';

export class UpdateAuthDto extends PartialType(ReqAuthDto) {}

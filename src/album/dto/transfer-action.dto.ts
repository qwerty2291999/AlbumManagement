/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, NotEquals } from 'class-validator';
import { STATUS } from '../album-transfer.entity';

export class TransferAction {
  uid: number;

  requestId: number;

  @ApiProperty()
  @IsEnum(STATUS)
  @NotEquals(STATUS.PENDING)
  status: STATUS;
}

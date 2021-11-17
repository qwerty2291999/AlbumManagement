/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
export class ConflictException extends HttpException {
  constructor() {
    super('Duplicate Unique Key', HttpStatus.CONFLICT);
  }
}
export class NoForeignKey extends HttpException {
  constructor(key) {
    super(`No Foreign Key Found : ${key}`, HttpStatus.BAD_REQUEST);
  }
}

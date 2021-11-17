/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
export function encodeJwt(key: object): string {
  const encode = jwt.sign(key, 'SECRET');
  return encode;
}
export async function decodeJwt(code: string): Promise<any> {
  const decode = jwt.verify(code, 'SECRET', (err, result) => {
    if (err) {
      throw new HttpException('Failed to decode', 400);
    } else {
      return result;
    }
  });
  return decode;
}

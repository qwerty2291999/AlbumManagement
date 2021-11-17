/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
export async function encode(password: string): Promise<string> {
  const saltRounds = 10;
  const encode = await bcrypt.hash(password, saltRounds);
  return encode;
}
export async function decode(
  password: string,
  encode: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, encode);
  if (isMatch == false) {
    throw new HttpException('Wrong Password', 401);
  }
  return isMatch;
}

/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decodeJwt } from '../../libs/jwt';

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new HttpException('Not Bearer Token', 400);
    }
    const token = bearerToken.split(' ');
    if (token[0] !== 'Bearer') {
      throw new HttpException('Not Bearer Token', 400);
    }
    const decode = await decodeJwt(token[1]);
    if (decode.status === true) {
      return next();
    }
    throw new HttpException('User is not verified', 401);
  }
}

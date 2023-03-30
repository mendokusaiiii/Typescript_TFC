import { NextFunction, Request, Response } from 'express';
import Erorrs from '../utils/error';
import { usersSchema, tokenSchema } from '../utils/schemas';
import IUsers from '../interfaces/IUsers';
import JWT from '../utils/jwt';

export function usersValidation(req: Request, _res: Response, next: NextFunction): void {
  const users: IUsers = req.body;
  const { error } = usersSchema.validate(users);

  if (error) throw new Erorrs(400, error.message);

  next();
}

export function tokenValidation(req: Request, _res: Response, next: NextFunction): void {
  const { authorization } = req.headers;

  if (!authorization) throw new Erorrs(401, 'Token not found');

  const jwt = new JWT();
  const payload = jwt.tokenValidate(authorization);

  const { error } = tokenSchema.validate(payload);

  if (error) throw new Erorrs(401, 'Token must be a valid token');

  next();
}

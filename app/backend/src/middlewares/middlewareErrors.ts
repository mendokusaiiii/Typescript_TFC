import { NextFunction, Request, Response } from 'express';
import Erorrs from '../utils/error';

export default function middlewareError(
  err: Erorrs,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { _status, message } = err as Erorrs;

  res.status(_status || 500).json({ message });
}

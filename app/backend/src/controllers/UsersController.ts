import { Request, Response } from 'express';
import UsersService from '../services/UsersService';

export default class UsersController {
  constructor(private usersService = new UsersService()) {}

  public async users(req: Request, res: Response) {
    const { email, password } = req.body;

    const token = await this.usersService.users(email, password);
    return res.status(200).json({ token });
  }

  public usersValidate(req: Request, res: Response) {
    const { authorization } = req.headers;

    const result = this.usersService.validate(authorization as string);
    return res.status(200).json({ role: result });
  }
}

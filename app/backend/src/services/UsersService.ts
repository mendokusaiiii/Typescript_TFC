import * as bcrypt from 'bcryptjs';
import { ModelStatic } from 'sequelize';
import Users from '../database/models/UsersModel';
import JWT from '../utils/jwt';
import Errors from '../utils/error';

export default class UsersService {
  constructor(
    private userModel: ModelStatic<Users> = Users,
    private jwt = new JWT(),
  ) {}

  public async users(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.dataValues.password)) {
      throw new Errors(401, 'Incorrect email or password');
    }

    const { password: any, ...rest } = user.dataValues;

    const token = this.jwt.tokenCreation(rest);

    return token;
  }

  public validate(token: string): string {
    const response = this.jwt.tokenValidate(token);

    const { role } = response;

    return role;
  }
}

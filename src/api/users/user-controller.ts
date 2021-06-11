import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Jwt from 'jsonwebtoken';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {Request} from '@/interfaces/request';
import {User} from './user';

export default class UserController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  private generateToken(user: User) {
    const jwtSecret = this.configs.jwtSecret;
    const jwtExpiration = this.configs.jwtExpiration;
    const payload = {id: user._id};

    return Jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiration});
  }

  public async createUser(request: Request, h: Hapi.ResponseToolkit) {
    try {
      let user: any = await this.database.userModel.create(request.payload);
      return h.response({token: this.generateToken(user)}).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }
}

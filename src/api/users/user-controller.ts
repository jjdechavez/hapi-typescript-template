import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Jwt from 'jsonwebtoken';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {LoginRequest, AuthRequest} from '@/interfaces/request';
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

  public async createUser(request: AuthRequest, h: Hapi.ResponseToolkit) {
    try {
      let user = await this.database.userModel.create(request.payload);
      return h.response({token: this.generateToken(user)}).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async loginUser(request: LoginRequest, h: Hapi.ResponseToolkit) {
    const {username, password} = request.payload;

    let user = await this.database.userModel.findOne({username}).exec();

    if (!user) {
      return Boom.unauthorized('User does not exist.');
    }

    if (!user.validatePassword(password)) {
      return Boom.unauthorized('Password is invalid.');
    }

    return {token: this.generateToken(user)};
  }

  public async infoUser(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const userId = request.auth.credentials.id;
    let user = await this.database.userModel
      .findById(userId)
      .select({name: 1, username: 1})
      .exec();

    if (!user) {
      return Boom.unauthorized('User does not exist.');
    }

    return user;
  }
}

import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ObjectId} from 'mongodb';
import Jwt from 'jsonwebtoken';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {LoginRequest, AuthRequest} from '@/interfaces/request';
import makeUser, {User} from './user';
import {validatePassword} from './utils/validatePassword';

export default class UserController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  private generateToken({
    id,
    username,
    name,
  }: {
    id: ObjectId;
    username: string;
    name: string;
  }) {
    const jwtSecret = this.configs.jwtSecret;
    const jwtExpiration = this.configs.jwtExpiration;
    const payload = {id, username, name};

    return Jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiration});
  }

  public async createUser(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const user = makeUser(request.payload as User);

    try {
      const doc = await this.database.userCollection.insertOne(user);
      return h
        .response({
          token: this.generateToken({
            id: doc.insertedId,
            username: user.username,
            name: user.name,
          }),
        })
        .code(201);
    } catch (error) {
      if (error.code === 11000) {
        return Boom.conflict('username must be unique');
      }

      return Boom.badImplementation(error);
    }
  }

  public async loginUser(request: LoginRequest, h: Hapi.ResponseToolkit) {
    const {username, password} = request.payload;

    let user = await this.database.userCollection.findOne({username});

    if (!user || !validatePassword(password, user.password)) {
      return Boom.unauthorized('Username or Password is invalid.');
    }

    const token = this.generateToken({
      id: user._id,
      username: user.username,
      name: user.name,
    });

    h.response({
      token,
    })
      .header('Authorization', token)
      .state('token', token, {
        isHttpOnly: true,
        encoding: 'none',
        path: '/',
      });

    return h.response({token}).code(200);
  }

  public async infoUser(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const userId = request.auth.credentials.id;

    let user = await this.database.userCollection.findOne(
      {
        _id: new ObjectId(userId),
      },
      {projection: {username: 1, _id: 1, name: 1}}
    );

    if (!user) {
      return Boom.unauthorized('User does not exist.');
    }

    return h.response(user).code(200);
  }
}

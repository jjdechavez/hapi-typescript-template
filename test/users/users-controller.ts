import Hapi from '@hapi/hapi';
import {expect} from '@hapi/code';
import * as Lab from '@hapi/lab';
import * as Configs from '../../src/configurations';
import * as Server from '../../src/server';
import * as Database from '../../src/database';
import userData from './users.fixtures.json';

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const serverConfig = Configs.getServerConfig();

const lab = Lab.script();
export {lab};

lab.experiment('UserController Test', () => {
  let server: Hapi.Server;

  lab.before(async () => {
    server = await Server.init(serverConfig, database);
    await database.userModel.deleteMany({});
  });

  lab.after(async () => {
    await server.stop();
  });

  userData.forEach((user: any) => {
    lab.test(`Should create user: ${user.name}}`, async () => {
      const res = await server.inject({
        method: 'POST',
        url: serverConfig.routePrefix + '/users',
        payload: user,
      });

      const response = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(201);
      expect(response.token).to.not.null();
    });
  });
});

import Hapi from '@hapi/hapi';
import {expect} from '@hapi/code';
import * as Lab from '@hapi/lab';
import * as Configs from '../../src/configurations';
import * as Server from '../../src/server';
import * as Database from '../../src/database';
import {UserTest} from '../users/users-controller';
import blogData from './blogs.fixtures.json';
import userData from '../users/users.fixtures.json';

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const serverConfig = Configs.getServerConfig();

const lab = Lab.script();
export {lab};

type Blog = {
  id?: string;
  name: string;
  description: string;
};

const users: UserTest[] = [];
const blogs: Blog[] = [];

lab.experiment('BlogController Test', () => {
  let server: Hapi.Server;

  lab.before(async () => {
    server = await Server.init(serverConfig, database);
    await database.userModel.deleteMany({});
    await database.blogModel.deleteMany({});
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

      users.push({...user, token: response.token});
    });
  });

  blogData.forEach((blog: Blog, index: number) => {
    lab.test(`Should create blog: ${blog.name}`, async () => {
      const res = await server.inject({
        method: 'POST',
        url: serverConfig.routePrefix + '/blogs',
        payload: blog,
        headers: {
          authorization: users[index].token,
        },
      });

      const response = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(201);
      expect(response.name).to.equal(blog.name);
      expect(response.description).to.equal(blog.description);
      expect(response).to.include('createdAt');
      expect(response).to.include('updatedAt');

      blogs.push({...blog, id: response._id});
    });
  });

  lab.test('Should list blogs with pagination', async () => {
    let res = await server.inject({
      method: 'GET',
      url: serverConfig.routePrefix + '/blogs?limit=2',
    });

    let json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json.length).to.equal(2);
    expect(json[0]).to.include('name');
    expect(json[0]).to.include('description');
    expect(json[0]).to.include('user');
    expect(json[0]).to.include('createdAt');
    expect(json[0]).to.include('updatedAt');

    res = await server.inject({
      method: 'GET',
      url: serverConfig.routePrefix + '/blogs?limit=2&skip=2',
    });

    json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json.length).to.equal(1);
  });

  lab.test('Should list blogs with default of 10', async () => {
    const res = await server.inject({
      method: 'GET',
      url: serverConfig.routePrefix + '/blogs',
    });

    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json.length).to.equal(3);
  });

  lab.test('Should fetch blog by id', async () => {
    const blog = blogs[0];
    const res = await server.inject({
      method: 'GET',
      url: serverConfig.routePrefix + `/blogs/${blog.id}`,
    });

    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(200);
    expect(json.id).to.equal(blog.id);
    expect(json.name).to.equal(blog.name);
    expect(json.description).to.equal(blog.description);
    expect(json).to.not.include('_id');
  });

  lab.test('Should throw blog not found', async () => {
    const res = await server.inject({
      method: 'GET',
      url: serverConfig.routePrefix + '/blogs/6288893bc0347c59c78995ec',
    });

    const json = JSON.parse(res.payload);
    expect(res.statusCode).to.equal(404);
    expect(json.message).to.equal('Not Found');
  });

  lab.test('Should remove blog', async () => {
    const {id} = blogs[2];
    const {token} = users[2];

    const res = await server.inject({
      method: 'DELETE',
      url: serverConfig.routePrefix + `/blogs/${id}`,
      headers: {
        authorization: token,
      },
    });

    expect(res.statusCode).to.be.equal(204);

    const blog = await database.blogModel.findOne({_id: id});
    expect(blog).to.be.null();
  });

  lab.test('Should update blog', async () => {
    const {id, description} = blogs[1];
    const {token} = users[1];

    const res = await server.inject({
      method: 'PUT',
      url: serverConfig.routePrefix + `/blogs/${id}`,
      headers: {
        authorization: token,
      },
      payload: {name: 'Updated Blog!'},
    });

    expect(res.statusCode).to.be.equal(204);

    const blog = await database.blogModel.findOne({_id: id});
    expect(blog).to.be.not.null();
    expect(blog!.name).to.be.equal('Updated Blog!');
    expect(blog!.description).to.be.equal(description);
  });
});

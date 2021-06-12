import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {AuthRequest} from '@/interfaces/request';
import {Todo} from './todo';

export default class TodoController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  public async createTodo(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let params = <Todo>request.payload;
    params.userId = request.auth.credentials.id;

    try {
      let todo = await this.database.todoModel.create(params);
      return h.response(todo).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }
}

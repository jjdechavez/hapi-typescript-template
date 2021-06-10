import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';

export default class TodoController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  public async createTodo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    let params = request.payload;

    try {
      let todo = await this.database.todoModel.create(params);
      return h.response(todo).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }
}

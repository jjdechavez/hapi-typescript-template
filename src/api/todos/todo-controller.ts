import Hapi, {Request} from '@hapi/hapi';
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

  public async getTodos(request: Request, h: Hapi.ResponseToolkit) {
    let limit = request.query['limit'];
    let skip = request.query['skip'];

    let todos = await this.database.todoModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return todos;
  }

  public async getTodoById(request: Request, h: Hapi.ResponseToolkit) {
    let _id = request.params['id'];

    let todo = await this.database.todoModel.findOne({_id}).lean().exec();

    if (!todo) {
      return Boom.notFound();
    }

    return todo;
  }
}

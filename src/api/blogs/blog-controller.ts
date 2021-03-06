import Hapi, {Request} from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {AuthRequest} from '@/interfaces/request';
import {Blog} from './blog';

export default class BlogController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  private documentToObject(document: Blog) {
    const {_id, ...data} = document.toObject();
    return {
      ...data,
      id: _id,
    };
  }

  public async createBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let params = <Blog>request.payload;
    params.user = request.auth.credentials.id;

    try {
      let blog = await this.database.blogModel.create(params);
      return h.response(blog).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async getBlogs(request: Request, h: Hapi.ResponseToolkit) {
    const limit = request.query['limit'] || 10;
    const page = request.query['skip'] || 1; // page
    const fields = {
      _id: 1,
      name: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
      user: 1,
    };

    const skip = limit * page - limit;

    const blogs = await this.database.blogModel
      .find({}, fields)
      .skip(skip)
      .sort({createdAt: -1})
      .limit(limit)
      .populate('user', 'name')
      .exec();

    const data = blogs.map(this.documentToObject);

    return h.response(data);
  }

  public async getBlogById(request: Request, h: Hapi.ResponseToolkit) {
    const _id = request.params['id'];
    const blog = await this.database.blogModel
      .findOne({_id})
      .populate('user', 'name')
      .exec();

    if (!blog) {
      return Boom.notFound();
    }

    const data = this.documentToObject(blog);

    return h.response(data);
  }

  public async getUserBlogs(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let userId = request.auth.credentials.id;
    let limit = request.query['limit'];

    const user = await this.database.userModel.findById(userId).exec();

    if (!user) {
      return Boom.unauthorized();
    }

    const blogs = await this.database.blogModel
      .find({user: user._id})
      .limit(limit)
      .sort({createdAt: -1})
      .populate('user', 'name')
      .exec();

    const userBlogs = blogs.map(this.documentToObject);

    return h.response(userBlogs);
  }

  public async updateBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const userId = request.auth.credentials.id;
    const blogId = request.params.id;
    const payload = <Blog>request.payload;

    try {
      const blog = await this.database.blogModel
        .findOneAndUpdate(
          {
            _id: blogId,
            user: userId,
          },
          {
            $set: payload,
          },
          {new: true}
        )
        .orFail()
        .exec();

      if (!blog) {
        return Boom.notFound();
      }

      return h.response().code(204);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async deleteBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let blogId = request.params['id'];
    let userId = request.auth.credentials.id;

    const deletedBlog = await this.database.blogModel
      .findOneAndDelete({_id: blogId, user: userId})
      .exec();

    if (!deletedBlog) {
      return Boom.notFound();
    }

    return h.response().code(204);
  }
}

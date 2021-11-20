import Hapi, {Request} from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {AuthRequest} from '@/interfaces/request';
import makeBlog, {Blog} from './blog';
import {Document, Filter, ObjectId} from 'mongodb';
import {User} from '../users/user';

export default class BlogController {
  constructor(
    private configs: ServerConfigurations,
    private database: Database
  ) {}

  private documentToBlog({_id: id, ...doc}: Blog) {
    return {
      id,
      ...doc,
    };
  }

  public async createBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let params = <Blog>request.payload;
    const {id, name} = request.auth.credentials;
    params.authorId = id;
    params.author = name;

    const blog = makeBlog(params);

    try {
      let doc = await this.database.blogCollection.insertOne(blog);
      return h.response({id: doc.insertedId}).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async getBlogs(request: Request, h: Hapi.ResponseToolkit) {
    const {limit = 10, before, after} = request.query;
    let filter: Filter<Document> = {};

    if (before || after) {
      filter._id = before ? {$lt: new ObjectId(before)} : filter._id;
      filter._id = after ? {$gt: new ObjectId(after)} : filter._id;
    }

    const project = {
      _id: 1,
      name: 1,
      description: 1,
      author: 1,
      authorId: 1,
      created: 1,
    };

    let blogs = (await this.database.blogCollection
      .find(filter)
      .sort({created: -1})
      .project(project)
      .limit(parseInt(limit, 10))
      .toArray()) as Blog[];

    blogs = blogs.map(this.documentToBlog);

    return h.response(blogs).code(200);
  }

  public async getBlogById(request: Request, h: Hapi.ResponseToolkit) {
    let id = request.params['id'];
    const blog = (await this.database.blogCollection.findOne({
      _id: new ObjectId(id),
    })) as Blog;

    if (!blog) {
      return Boom.notFound();
    }

    return h.response(this.documentToBlog(blog)).code(200);
  }

  public async getUserBlogs(request: AuthRequest, h: Hapi.ResponseToolkit) {
    let {id, username} = request.auth.credentials;
    let limit = request.query['limit'];

    const user = (await this.database.userCollection.findOne({
      _id: new ObjectId(id),
      username,
    })) as User;

    if (!user) {
      return Boom.unauthorized();
    }

    const authorId = user._id?.toString();

    const project = {
      _id: 1,
      name: 1,
      description: 1,
      author: 1,
      authorId: 1,
      created: 1,
      modfied: 1,
    };

    let blogs = (await this.database.blogCollection
      .find({authorId})
      .project(project)
      .sort({created: -1})
      .limit(limit)
      .toArray()) as Blog[];

    blogs = blogs.map(this.documentToBlog);

    return h.response(blogs).code(200);
  }

  public async updateBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const authorId = request.auth.credentials.id;
    const blogId = request.params.id;
    const changes = <Blog>request.payload;

    const existingBlog = await this.database.blogCollection.findOne({
      _id: new ObjectId(blogId),
      authorId,
    });

    if (!existingBlog) {
      return Boom.notFound();
    }

    const blog = makeBlog({...existingBlog, ...changes, modified: null});

    try {
      const updatedBlog = await this.database.blogCollection.updateOne(
        {
          _id: new ObjectId(blogId),
          authorId,
        },
        {
          $set: blog,
        }
      );

      if (!updatedBlog) {
        return Boom.notFound();
      }

      return h.response().code(204);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async deleteBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
    const blogId = request.params['id'];
    const authorId = request.auth.credentials.id;

    const deletedBlog = await this.database.blogCollection.findOneAndDelete({
      _id: new ObjectId(blogId),
      authorId,
    });

    if (!deletedBlog) {
      return Boom.notFound();
    }

    return h.response().code(204);
  }
}

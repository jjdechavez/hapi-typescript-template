import Hapi, {Request} from '@hapi/hapi';
import Boom from '@hapi/boom';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {AuthRequest} from '@/interfaces/request';
import makeBlog, {Blog} from './blog';
import {Document, Filter, ObjectId} from 'mongodb';

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

    console.log(filter);

    let blogs = (await this.database.blogCollection
      .find(filter)
      .sort({createdAt: -1})
      .project(project)
      .limit(parseInt(limit, 10))
      .toArray()) as Blog[];

    blogs = blogs.map(this.documentToBlog);

    return h.response(blogs).code(200);
  }

  // public async getBlogById(request: Request, h: Hapi.ResponseToolkit) {
  //   let _id = request.params['id'];
  //   let blog = await this.database.blogModel
  //     .findOne({_id})
  //     .populate('user', 'name')
  //     .lean()
  //     .exec();

  //   if (!blog) {
  //     return Boom.notFound();
  //   }

  //   return h.response(blog);
  // }

  // public async getUserBlogs(request: AuthRequest, h: Hapi.ResponseToolkit) {
  //   let userId = request.auth.credentials.id;
  //   let limit = request.query['limit'];

  //   const user = await this.database.userModel.findById(userId).exec();

  //   if (!user) {
  //     return Boom.unauthorized();
  //   }

  //   const userBlogs = await this.database.blogModel
  //     .find({user: user._id})
  //     .limit(limit)
  //     .sort({createdAt: -1})
  //     .populate('user', 'name')
  //     .lean()
  //     .exec();

  //   return h.response(userBlogs);
  // }

  // public async updateBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
  //   let userId = request.auth.credentials.id;
  //   let blogId = request.params.id;
  //   let payload = <Blog>request.payload;

  //   try {
  //     let blog = await this.database.blogModel
  //       .findOneAndUpdate(
  //         {
  //           _id: blogId,
  //           user: userId,
  //         },
  //         {
  //           $set: payload,
  //         },
  //         {new: true}
  //       )
  //       .orFail()
  //       .exec();

  //     if (!blog) {
  //       return Boom.notFound();
  //     }

  //     return h.response(blog);
  //   } catch (error) {
  //     return Boom.badImplementation(error);
  //   }
  // }

  // public async deleteBlog(request: AuthRequest, h: Hapi.ResponseToolkit) {
  //   let blogId = request.params['id'];
  //   let userId = request.auth.credentials.id;

  //   const deletedBlog = await this.database.blogModel
  //     .findOneAndDelete({_id: blogId, user: userId})
  //     .exec();

  //   if (!deletedBlog) {
  //     return Boom.notFound();
  //   }

  //   return h.response(deletedBlog);
  // }
}

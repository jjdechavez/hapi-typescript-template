import {Collection, ObjectId} from 'mongodb';
import Bcrypt from 'bcryptjs';

export interface User extends Collection {
  _id?: ObjectId;
  name: string;
  username: string;
  password: string;
  created: Date;
  modified: Date;
}

export interface UserInfo {
  name: string;
  username: string;
  password: string;
}

export default function makeUser(userInfo: UserInfo) {
  const normalUser = normalize(userInfo);
  return normalUser;

  function normalize({username, password, ...info}: UserInfo) {
    return {
      ...info,
      username: username.toLowerCase(),
      password: hashPassword(password),
      created: new Date(),
      modified: new Date(),
    };
  }

  function hashPassword(password: string): string {
    if (!password) {
      return '';
    }
    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
  }
}

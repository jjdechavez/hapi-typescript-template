import Hapi from '@hapi/hapi';

export interface Credentials extends Hapi.AuthCredentials {
  id: string;
  username: string;
}

export interface RequestAuth extends Hapi.RequestAuth {
  credentials: Credentials;
}

export interface AuthRequest extends Hapi.Request {
  auth: RequestAuth;
}

export interface LoginRequest extends AuthRequest {
  payload: {
    username: string;
    password: string;
  };
}

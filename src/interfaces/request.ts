import Hapi from '@hapi/hapi';

export interface Credentials extends Hapi.AuthCredentials {
  id: string;
}

export interface RequestAuth extends Hapi.RequestAuth {
  credentials: Credentials;
}

export interface Request extends Hapi.Request {
  auth: RequestAuth;
}

export interface LoginRequest extends Request {
  payload: {
    email: string;
    password: string;
  };
}

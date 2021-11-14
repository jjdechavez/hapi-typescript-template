import Bcrypt from 'bcryptjs';

export function validatePassword(requestPassword: string, password: string) {
  return Bcrypt.compareSync(requestPassword, password);
}

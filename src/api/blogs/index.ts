import Hapi from '@hapi/hapi';
import Routes from './routes';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';

export function init(
  server: Hapi.Server,
  configs: ServerConfigurations,
  database: Database
) {
  Routes(server, configs, database);
}

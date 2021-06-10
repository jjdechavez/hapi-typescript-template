import Hapi from '@hapi/hapi';
import {ServerConfigurations} from '../configurations';
import {Database} from '../database';

export interface PluginOptions {
  database: Database;
  serverConfigs: ServerConfigurations;
}

export interface Plugin {
  register(server: Hapi.Server, options?: PluginOptions): Promise<void>;
  info(): PluginInfo;
}

export interface PluginInfo {
  name: string;
  version: string;
}

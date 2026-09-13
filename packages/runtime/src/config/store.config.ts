import {
  StoreFactory,
} from '../core/store/store.factory.js';

export async function mysql() {

  const password =
    process.env.MYSQL_PASSWORD;

  if (!password) {
    throw new Error(
      'MYSQL_PASSWORD is required when STORE_TYPE=mysql'
    );
  }

  return StoreFactory.create({
    type: 'mysql',

    host:
      process.env.MYSQL_HOST ??
      'localhost',

    port: Number(
      process.env.MYSQL_PORT ??
      3306
    ),

    database:
      process.env.MYSQL_DATABASE ??
      'stateflowx',

    user:
      process.env.MYSQL_USER ??
      'root',

    password,

    table:
      process.env.MYSQL_TABLE ??
      'stateflowx_store',
  });
}

export async function memory() {
  return StoreFactory.create({
    type: 'memory',
  });
}
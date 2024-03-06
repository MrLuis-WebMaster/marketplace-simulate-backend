import { Sequelize } from 'sequelize-typescript';

import { env } from '@/common/utils/envConfig';

import { ProductEntity } from '../entity/product.entity';
import { UserEntity } from '../entity/user.entity';

const sequelize = new Sequelize({
  database: env.DB_NAME,
  host: env.DB_HOST,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  dialect: 'postgres',
  models: [UserEntity, ProductEntity],
});

export default sequelize;

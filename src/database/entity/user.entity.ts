import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { ProductEntity } from './product.entity';

export enum UserRole {
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
})
export class UserEntity extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: UserRole;

  @HasMany(() => ProductEntity)
  declare products: ProductEntity[];
}

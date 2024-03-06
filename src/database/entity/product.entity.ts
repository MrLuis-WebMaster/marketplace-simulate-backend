import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { UserEntity } from './user.entity';

@Table({
  timestamps: true,
  tableName: 'products',
  modelName: 'Product',
})
export class ProductEntity extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare sku: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => UserEntity)
  declare user: UserEntity;
}

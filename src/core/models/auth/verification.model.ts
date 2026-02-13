import { Column, Default, Index, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'verifications' })
export class Verification extends Model<Verification> {
    @Index
    @Column
    authField: string;

    @Column
    code: string;

    @Default(false)
    @Column
    isValidate: boolean;

    @Column('bigint')
    lastRequestTime: number;

}
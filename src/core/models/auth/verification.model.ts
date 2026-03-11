import { Column, Index, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'verifications' })
export class Verification extends Model<Verification> {
    @Index
    @Column
    authField: string;

    @Column
    cipher: string;

    @Column
    code: string;

    @Column('bigint')
    lastRequestTime: number;

}
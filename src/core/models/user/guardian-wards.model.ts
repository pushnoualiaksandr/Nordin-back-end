import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/core/models';

@Table({ tableName: 'guardian_wards' })
export class GuardianWard extends Model<GuardianWard> {

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    guardianId: number;

    @BelongsTo(() => User, 'guardianId')
    guardian: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    wardId: number;

    @BelongsTo(() => User, 'wardId')
    ward: User;


}
import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '@/core/models/user/user.model';
import { Clinic } from '@/core/models/clinic/clinic.model';


@Table({ tableName: 'clinic_users' })
export class ClinicUser extends Model<ClinicUser> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Clinic)
    @Column({ type: DataType.INTEGER, allowNull: false })
    clinicId: number;

    @BelongsTo(() => Clinic)
    clinic: Clinic;
}
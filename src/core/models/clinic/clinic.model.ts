import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AuthFlowsType } from '@/utils/data/types/auth-flows.type';
import { User } from '@/core/models/user/user.model';
import { ClinicUser } from '@/core/models/clinic/clinic-user.model';
import { ApiProperty } from '@nestjs/swagger';


@Table({ tableName: 'clinics' })
export class Clinic extends Model<Clinic> {

    @ApiProperty({
        example: 1,
        readOnly: true
    })
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ApiProperty({
       example: 'City Medical Center',
    })
    @Column
    name: string;

    @ApiProperty({
        example: 'Minsk',
    })
    @Column
    city: string;

    @ApiProperty({
        example: 'Surganova Street 47B',
    })
    @Column
    street: string;

    @ApiProperty({
        type: [String],
        example: ['375445060159', '375335060159', '375255060159'],
    })
    @Column({ type: DataType.ARRAY(DataType.STRING) })
    phones: string[];

    @ApiProperty({
        example: '159',
    })
    @Column
    shortPhone: string;

    @ApiProperty({
        type: 'object',
        example: {
            1: ['/home', '/appointments'],
            2: ['/dashboard'],
            3: ['/news'],
            4: ['/documents']
        },
        additionalProperties: {
            type: 'array',
            items: { type: 'string' }
        }
    })
    @Column({ type: DataType.ARRAY(DataType.JSONB) })
    authFlows: AuthFlowsType;

    @BelongsToMany(() => User, () => ClinicUser)
    users: Array<User & { ClinicUser: ClinicUser }>;
}

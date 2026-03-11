import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from '@/core/models/user/user.model';
import { ClinicUser } from '@/core/models/clinic/clinic-user.model';
import { ApiProperty } from '@nestjs/swagger';
import { ClinicDescriptionDto } from '@/modules/clinic/data/clinic/dto/clinic-descriptin.dto';


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
        type: String,
        example: '8(029)22 22 159',
    })
    @Column({ type: DataType.STRING(512) })
    socialNetwork: string;

    @ApiProperty({
        type: String,
        example: 'пн-пт 7.30-22.00',
    })
    @Column({ type: DataType.STRING(512) })
    clinicOperations:string;

    @ApiProperty({
        example: '159',
    })
    @Column
    shortPhone: string;

    @ApiProperty({
        type: [String],
        example: ['375445060159', '375335060159', '375255060159'],
    })
    @Column({ type: DataType.ARRAY(DataType.STRING) })
    phones: string[];


    @Column({ type: DataType.JSONB })
    desc: ClinicDescriptionDto;

    @BelongsToMany(() => User, () => ClinicUser)
    users: Array<User & { ClinicUser: ClinicUser }>;
}

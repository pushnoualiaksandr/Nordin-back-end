import {
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    Default,
    HasOne,
    Index,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import { Gender } from '@/utils/data/enums/Gender';
import { Role } from '@/utils/data/enums/Role';
import { Clinic } from '@/core/models/clinic/clinic.model';
import { ClinicUser } from '@/core/models/clinic/clinic-user.model';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GuardianWard, Token } from '@/core/models';


@Table({ tableName: 'users' })
export class User extends Model<User> {

    @ApiProperty({
        example: 1,
        readOnly: true
    })
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ApiProperty({
      example: Gender.MALE
    })
    @Default(Gender.MALE)
    @Column({ type: DataType.ENUM(...Object.values(Gender)), allowNull: false })
    gender: Gender;

    @ApiProperty({
      example: '375291234567',
    })
    @Index
    @Column
    phone: string;

    
    @ApiProperty({
        example: '2',
    })
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false
    })
    misId: number;

    @ApiProperty({
        example: 'd5dss5',
    })
     @Column({ type: DataType.STRING(128),unique: true })
     avatarKey: string;

    @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    })
    @Column
    avatarUrl: string;


    @ApiProperty({
        example: UserStatus.UNVERIFIED,
    })

    @Default(UserStatus.UNVERIFIED)
    @Column({ type: DataType.ENUM(...Object.values(UserStatus)) })
    status: UserStatus;


    @ApiProperty({
        example: Role.PATIENT,
    })
    @Default(Role.PATIENT)
    @Column({
        type: DataType.ENUM(...Object.values(Role)),
        allowNull: false
    })
    role: Role;

    @ApiPropertyOptional({
        example: true,
    })
    @Default(true)
    @Column
    isAdult: boolean;

    @ApiPropertyOptional({
        example: true,
    })
    @Default(true)
    @Column
    isNotificationsEnabled: boolean;


    @ApiPropertyOptional({
        example: true,
    })
    @Default( false)
    @Column
    isFaceId: boolean;

    @ApiPropertyOptional({
        example: true,
    })
    @Default( false)
    @Column
    isCodPass: boolean;

    @HasOne(() => Token)
    tokens: Token;

    @BelongsToMany(() => Clinic, () => ClinicUser)
    clinics: Array<Clinic & { ClinicUser: ClinicUser }>;

    @BelongsToMany(() => User, () => GuardianWard, 'guardianId', 'wardId')
    wards: User[];

    @BelongsToMany(() => User, () => GuardianWard, 'wardId', 'guardianId')
    guardians: User[];
}
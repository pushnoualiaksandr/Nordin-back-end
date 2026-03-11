import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcrypt';
import { User } from '@/core/models';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
    @ApiProperty({
        example: 1,
        readOnly: true
    })
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ApiProperty({
        example: '1945CD157D331DB5FB5238C8FFF57E4C',
    })
    @Column(DataType.STRING(512))
    cipher: string;

    @ApiProperty({
        example: '1234',
     })
    @Column(DataType.STRING(512))
    code: string;


    @ApiProperty({
        example: '1945CD157D331DB5FB5238C8FFF57E4C',
     })
    @Column(DataType.STRING(512))
    codePassHash: string;

    @ApiProperty({
        example: '1234',
    })
    @Column(DataType.STRING(512))
    publicKey: string;

    @ApiProperty({
        example: '1234',
    })
    @Column(DataType.TEXT)
    deviceId: string;


    @ApiProperty({
        type: 'string',
        example: 'string',

    })
    @Column({
        type: DataType.TEXT,
        allowNull: true,
        set(value: string) {
            if (value === null) {
                this.setDataValue('refreshToken', null);
                return;
            }

            const saltRound = +process.env.SALT_ROUND;

            if (!saltRound) {
                throw new Error('Salt not defined');
            }

            this.setDataValue('refreshToken', hashSync(value, saltRound));
        },
    })
    refreshToken: string;


    @ApiProperty({
        type: [String],
        example: ['string', 'string'],
    })
    @Column({ type: DataType.ARRAY(DataType.STRING) })
    fcmTokens: string[];

    @ApiProperty({
        example: '2024-12-31T23:59:59.999Z',
        type: 'string',
        format: 'date-time'
    })
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    refreshTokenExpiresAt: Date;

    @ApiProperty({
        example: 1,
        readOnly: true
    })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;

}
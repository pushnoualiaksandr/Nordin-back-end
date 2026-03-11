import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Index,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import { User } from '@/core/models/user/user.model';

@Table({ tableName: 'tokens' })
export class Tokens extends Model<Tokens> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Index
    @Column({type: DataType.TEXT})
    refreshToken: string;

    @Column
    code: string;

    @Column(DataType.STRING(512))
    codePassHash: string;

    @Column({ type: DataType.ARRAY(DataType.TEXT) })
    fcmTokens: string[];

    @Column({ type: DataType.DATE })
    refreshTokenExpiresAt: Date;

    @Column({ type: DataType.STRING(512)})
    deviceId: string;

    @Column({ type: DataType.STRING(512)})
    publicKey: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}

import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { LogType } from '../../../config/logs';
import { UserLog } from '@database/entities/user-log.entity';

/*
    The user logs are seeded and searched for based on the 'UserActionsIds' object.
    If the descriptions or logType are updated, please update them here.
 */
@Entity()
export class UserActions extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    userActionId: number;

    @Column('enum', { enum: LogType })
    logType: LogType;

    @Column('text')
    @Index({ unique: true })
    description: string;

    @OneToMany(type => UserLog, userLog => userLog.action)
    userLogs: UserLog[];
}

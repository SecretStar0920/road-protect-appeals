import { TimeStamped } from '@database/entities/timestamped.entity';
import { Entity, Index, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@database/entities/user.entity';
import { UserActions } from '@database/entities/user-actions.entity';

@Entity()
export class UserLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    userLogId: number;

    @Column({
        type: 'jsonb',
        nullable: true,
    })
    details: any;

    @ManyToOne(type => UserActions, action => action.userLogs, { nullable: false })
    @JoinColumn({ name: 'userActionId', referencedColumnName: 'userActionId' })
    action: UserActions;

    @ManyToOne(type => User, user => user.userLogs, { nullable: false })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}

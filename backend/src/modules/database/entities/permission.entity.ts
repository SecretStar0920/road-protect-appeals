import { TimeStamped } from '@database/entities/timestamped.entity';
import { User } from '@database/entities/user.entity';
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    permissionId: number;

    @Column('text')
    name: string;

    @Column('text')
    group: string;

    @ManyToMany(type => User, user => user.permissions)
    users: User[];
}

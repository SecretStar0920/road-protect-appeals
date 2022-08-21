import { CouponLog } from '@database/entities/coupon-log.entity';
import { Permission } from '@database/entities/permission.entity';
import { BadRequestException } from '@nestjs/common';
import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { Ticket } from '@database/entities/ticket.entity';
import { UserLog } from '@database/entities/user-log.entity';

export const USER_CONSTRAINTS = {
    mobile: {
        keys: ['mobileNumber'],
        constraint: 'unique_mobile_number',
        description: 'An account with this mobile number already exists',
    },
};

export enum UserType {
    Admin = 'Admin',
    Developer = 'Developer',
    Standard = 'Standard',
    API = 'API',
}

@Entity()
@Unique(USER_CONSTRAINTS.mobile.constraint, USER_CONSTRAINTS.mobile.keys)
export class User extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    userId: number;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text')
    mobileNumber: string;

    @Column('int', { nullable: true })
    roadProtectZAId: number;

    @Column('text', { nullable: true })
    email: string;

    @Column('text', { nullable: true })
    israeliId: string;

    @Column('text', { nullable: true })
    city: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('text', { select: false, nullable: true })
    password: string;

    @Column('enum', { enum: UserType, default: UserType.Standard })
    type: UserType;

    @Column('jsonb', { default: {} })
    details: any;

    @OneToMany(type => CouponLog, couponLog => couponLog.coupon)
    couponLogs: CouponLog[];

    @ManyToMany(type => Permission, permission => permission.users)
    @JoinTable()
    permissions: Permission[];

    @OneToMany(type => Ticket, ticket => ticket.user, { nullable: true })
    tickets: Ticket[];

    username: string;

    @OneToMany(type => UserLog, userLog => userLog.user, { cascade: true })
    userLogs: UserLog[];

    @AfterInsert()
    @AfterUpdate()
    @AfterLoad()
    getUsername() {
        this.username = `${this.firstName}_${this.lastName}_${this.mobileNumber}`;
        return this.username;
    }

    async getPassword(): Promise<string | undefined> {
        const user = await User.findOne(this.userId, { select: ['password'] });
        return user ? user.password : undefined;
    }
}

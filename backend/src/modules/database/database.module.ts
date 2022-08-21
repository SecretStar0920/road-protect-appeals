import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConnections } from './database-connections';

@Module({
    imports: [...databaseConnections],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

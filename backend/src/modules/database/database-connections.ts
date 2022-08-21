import config from '@config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as appRootPath from 'app-root-path';
import * as path from 'path';

export const databaseConnections = [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: config.databases.main.host,
        port: config.databases.main.port,
        username: config.databases.main.username,
        password: config.databases.main.password,
        name: config.databases.main.name,
        database: config.databases.main.database,
        entities: [
            // Add the paths to modules that use the main database here
            `${path.join(appRootPath.path, 'src', 'modules', 'database', 'entities')}/**/*{.ts,.js}`,
        ],
        // logging: true,
        // Only sync if we're in development, otherwise we should just leave
        // it.
        synchronize: config.environment.isDev() || config.environment.isTesting(),
        cache: {
            type: 'redis',
            options: config.redis,
        },
    }),
];

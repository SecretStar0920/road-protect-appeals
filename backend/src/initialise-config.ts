import * as appRootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import * as path from 'path';

export function initialiseConfig() {
    dotenv.config({ path: path.join(appRootPath.path, '.env') });
}

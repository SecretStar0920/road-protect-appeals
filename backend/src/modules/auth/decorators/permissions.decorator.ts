import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: Array<{ name: string; group: string }>) =>
    SetMetadata('permissions', permissions);

import config from '@config';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import uuid from 'uuid';

@Injectable()
export class PasswordService {
    constructor() {}

    public async generatePassword(password: string = ''): Promise<{ raw: string; hashed: string; bcrypted: string }> {
        const raw = password ? password : uuid();
        const hashed = crypto.createHash('SHA512').update(raw).digest('hex');
        const bcrypted = await this.generateBcryptHash(hashed);
        return {
            raw,
            hashed,
            bcrypted,
        };
    }

    public async generateBcryptHash(hashed: string) {
        const bcrypted = await bcrypt.hash(hashed, config.auth.bcrypt.rounds);
        return bcrypted;
    }
}

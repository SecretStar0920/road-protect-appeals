import { MyController } from '../helpers/decorators';
import { Post, Body } from '@nestjs/common';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { PostmarkService } from '../services/postmark.service';
import { Message } from 'postmark';

@MyController('email', 'Email')
export default class EmailController {
    constructor(private readonly postmarkService: PostmarkService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('send')
    public async send(@Body() body: Message): Promise<boolean> {
        return this.postmarkService.sendEmail(body);
    }
}

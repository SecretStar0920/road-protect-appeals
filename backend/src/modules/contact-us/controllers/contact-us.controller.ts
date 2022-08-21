import { Body, Controller, Post } from '@nestjs/common';
import { MyController } from '../../../helpers/decorators';
import { ContactUsService } from '../services/contact-us.service';
import { ContactUsDto } from './contact-us.dto';

@MyController('contact-us', 'ContactUs')
export class ContactUsController {
    constructor(private contactUsService: ContactUsService) {}

    @Post()
    async contactUs(@Body() dto: ContactUsDto): Promise<boolean> {
        return this.contactUsService.handle(dto);
    }
}

import { MyController } from '../helpers/decorators';
import { Get } from '@nestjs/common';

@MyController('/')
export default class DefaultController {
    @Get('')
    index() {
        return 'ok';
    }

    @Get('health')
    healthGet() {
        return 'ok';
    }
}

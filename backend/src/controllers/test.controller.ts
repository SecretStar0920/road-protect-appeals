import { MyController } from '../helpers/decorators';
import { Get, Res } from '@nestjs/common';

@MyController('test', 'Test')
export default class TestController {
    @Get('alive')
    public async alive(@Res() response) {
        return response.status(200).json(true);
    }

    @Get('servers')
    public async servers(@Res() response) {
        return response.status(200).json(true);
    }
}

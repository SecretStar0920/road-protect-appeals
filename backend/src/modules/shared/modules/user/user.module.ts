import { LoggerService } from '@logger';
import { forwardRef, Module } from '@nestjs/common';
import { FaxService } from '../../../../services/fax.service';
import { PostmarkService } from '../../../../services/postmark.service';
import { ZaService } from '../../../../services/za/za.service';
import { CreateUserService } from './services/create-user/create-user.service';
import { GetUserService } from './services/get-user/get-user.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { UpdateUserLogsService } from './services/user-logs/update-user-logs.service';
import { GetUserActionService } from './services/user-actions/get-user-action.service';
import { UpdatePaymentsService } from '../../../payment/services/update-payments.service';
import { GetCouponService } from '../../../coupon/services/get-coupon.service';
import { SharedModule } from '../../shared.module';

@Module({
    imports: [forwardRef(() => SharedModule)],
    providers: [
        CreateUserService,
        LoggerService,
        GetUserService,
        UpdateUserService,
        GetCouponService,
        UpdatePaymentsService,
        ZaService,
        PostmarkService,
        FaxService,
        UpdateUserLogsService,
        GetUserActionService,
    ],
    exports: [CreateUserService, GetUserActionService, GetUserService, UpdateUserService, UpdateUserLogsService],
})
export class UserModule {}

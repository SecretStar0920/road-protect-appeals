import { HttpModule, Module } from '@nestjs/common';
import controllers from './controllers';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DatabaseModule } from './modules/database/database.module';
import { EmailModule } from './modules/email/email.module';
import providers from './services';
import { SeederModule } from './modules/seeder/seeder.module';
import { SharedModule } from './modules/shared/shared.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
    imports: [
        AuthModule,
        ContactUsModule,
        CouponModule,
        CustomerModule,
        DatabaseModule,
        EmailModule,
        HttpModule,
        PaymentModule,
        SeederModule,
        SharedModule,
    ],
    controllers,
    providers,
})
export class AppModule {}

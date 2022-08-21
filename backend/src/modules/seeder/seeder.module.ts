import { VehicleSeederService } from './seeders/vehicle-seeder.service';
import { SeederService } from './seeder.service';
import { Module } from '@nestjs/common';
import { RedisService } from '../../services/redis.service';
import { ResourcesLoader } from '../../services/resources.loader';
import { CarService } from '../../services/car.service';
import { LoggerService } from '@logger';
import { MunicipalitySeederService } from './seeders/municipality-seeder.service';
import { ZaService } from '../../services/za/za.service';
import { FaxService } from '../../services/fax.service';
import { PostmarkService } from '../../services/postmark.service';
import { UserActionsSeederService } from './seeders/user-actions-seeder.service';
import { UpdatePaymentsService } from '../payment/services/update-payments.service';
import { SharedModule } from '../shared/shared.module';
import { GetCouponService } from '../coupon/services/get-coupon.service';
import { UserSeederService } from './seeders/user-seeder.service';

@Module({
    imports: [SharedModule],
    providers: [
        SeederService,
        VehicleSeederService,
        GetCouponService,
        UserActionsSeederService,
        MunicipalitySeederService,
        ZaService,
        UpdatePaymentsService,
        FaxService,
        PostmarkService,
        RedisService,
        LoggerService,
        ResourcesLoader,
        CarService,
        UserSeederService,
    ],
})
export class SeederModule {}

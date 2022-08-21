import { Module } from '@nestjs/common';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UserModule } from './modules/user/user.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { MunicipalityModule } from './modules/municipality/municipality.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
    imports: [TicketsModule, UserModule, VehicleModule, MunicipalityModule, RealtimeModule],
    providers: [],
    exports: [TicketsModule, UserModule, VehicleModule, MunicipalityModule, RealtimeModule],
})
export class SharedModule {}

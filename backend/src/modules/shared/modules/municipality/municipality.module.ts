import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from '../../shared.module';
import { LoggerService } from '@logger';
import { GetMunicipalityService } from './services/get-municipality.service';

@Module({
    imports: [forwardRef(() => SharedModule)],
    providers: [LoggerService, GetMunicipalityService],
    exports: [GetMunicipalityService],
})
export class MunicipalityModule {}

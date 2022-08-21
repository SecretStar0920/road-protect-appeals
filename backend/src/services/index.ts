import { AuthorizationService } from './authorization.service';
import { CarService } from './car.service';
import { CityService } from './city.service';
import { FaxService } from './fax.service';
import { LoggerService } from '@logger';
import { GetTicketStatusNameService } from './get-ticket-status-name.service';
import { PostmarkService } from './postmark.service';
import { RedisService } from './redis.service';
import { ResourcesLoader } from './resources.loader';
import { ZaService } from './za/za.service';
import { PaymentService } from '../modules/payment/services/payment.service';
import { UpdatePaymentsService } from '../modules/payment/services/update-payments.service';
import { GetCouponService } from '../modules/coupon/services/get-coupon.service';
import { QuestionAndAnwserDataService } from './question-and-anwser-data.service';
import { AppealDetailsRequestsService } from './requests/appeal-details-requests.service';
import { LegalParagraphRequestsService } from './requests/legal-paragraph-requests.service';

export default [
    AuthorizationService,
    CarService,
    CityService,
    FaxService,
    GetCouponService,
    GetTicketStatusNameService,
    LoggerService,
    PaymentService,
    PostmarkService,
    RedisService,
    ResourcesLoader,
    UpdatePaymentsService,
    ZaService,
    QuestionAndAnwserDataService,
    AppealDetailsRequestsService,
    LegalParagraphRequestsService,
];

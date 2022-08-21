import AuthorizationController from './authorization.controller';
import CarController from './car.controller';
import CityController from './city.controller';
import DefaultController from './default.controller';
import EmailController from './email.controller';
import FaxController from './fax.controller';
import TestController from './test.controller';
import ZaController from './za.controller';
import { AppealDetailsController } from './appeal-details.controller';
import { LegalParagraphController } from './legal-paragraphs.controller';

export default [
    AuthorizationController,
    TestController,
    CarController,
    CityController,
    ZaController,
    EmailController,
    FaxController,
    DefaultController,
    AppealDetailsController,
    LegalParagraphController,
];

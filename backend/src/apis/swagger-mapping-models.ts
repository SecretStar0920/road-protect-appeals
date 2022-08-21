import { ApiModel } from '../helpers/decorators';
import {
    AddTicketRequest,
    AddUserRequest,
    GetAuthorizationTokenRequest,
    InlineObject,
    UpdateCustomerProfileRequest,
    UpdateTicketRequest,
    UploadTicketDocumentRequest,
} from './ZA/api';

export default () => {
    ApiModel()(AddTicketRequest);
    ApiModel()(AddUserRequest);
    ApiModel()(GetAuthorizationTokenRequest);
    ApiModel()(InlineObject);
    ApiModel()(UpdateCustomerProfileRequest);
    ApiModel()(UpdateTicketRequest);
    ApiModel()(UploadTicketDocumentRequest);
};

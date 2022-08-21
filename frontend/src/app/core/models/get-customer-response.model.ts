import { CustomerModel } from './customer.model';
import { TicketModel } from './ticket.model';

export interface GetCustomerResponseModel {
    user: CustomerModel;
    tickets: TicketModel[];
}

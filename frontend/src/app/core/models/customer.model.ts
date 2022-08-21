export interface CustomerModel {
    address: string;
    allow_add_on_membership: 'false' | 'true';
    city: string;
    country: string;
    customerSubscription: 'inactive' | 'active';
    dateOfBirth: string;
    email: string;
    firstName: string;
    hasMembership: boolean;
    homeNumber: string;
    id: number;
    imageUploaded: 'false' | 'true';
    israelIdNumber: string;
    lastName: string;
    mobile: string;
}

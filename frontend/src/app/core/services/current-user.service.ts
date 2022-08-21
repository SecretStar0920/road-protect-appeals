import { Injectable } from '@angular/core';

class User {
    userId: number;
    mobileNumber: string;
}

@Injectable({
    providedIn: 'root',
})
export class CurrentUserService {
    private currentUser: User;

    constructor() {}

    get user(): Partial<User> {
        return this.currentUser;
    }

    set user(user: Partial<User>) {
        this.currentUser = {
            ...this.currentUser,
            ...user,
        };
    }
}

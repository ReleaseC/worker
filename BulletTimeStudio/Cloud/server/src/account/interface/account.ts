import { Document } from 'mongoose';

export enum ACCOUNT_ROLE {
    GROUP_ADMIN,
    GROUP_CUSTOMER
}

export interface Account extends Document {
    readonly name: String;
    readonly password: String;
    readonly role: ACCOUNT_ROLE;
}

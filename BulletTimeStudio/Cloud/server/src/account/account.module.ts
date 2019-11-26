import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

@Module({
    controllers: [
        AccountController,
    ],
    components: [
        AccountService,
        AuthService
    ],
})
export class AccountModule {}
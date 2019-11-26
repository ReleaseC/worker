import { Controller, Get, Post, Res, Body, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('notification')
@UseGuards(RolesGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * @api {get} /notification/alert alert (Obsolete)
     * @apiVersion 1.0.0
     * @apiName alert 
     * @apiGroup notification
     * 
     */
    @Post('alert')
    async alert(@Res() res, @Body() sub, @Query() type) {
        // sub: subscription data
        // ref: https://gist.github.com/jhades/4f9b93daa3469ba65c60e1e47b1a9f9b#file-03-ts
        try {
            const ret = await this.notificationService.alert(sub, type);
            res.status(HttpStatus.OK).json(ret);
        } catch (err) {
            console.error('Error sending notification, reason: ', err);
            res.sendStatus(500);
        };
    }
}
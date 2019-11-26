import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { RET_STATUS, RetObject } from '../common/ret.component';

@Controller('system')
export class SystemController {
    @Get('version')
    version(@Res() res) {
        let ret = new RetObject;
        let result = {'version': '0.0.1', 'description': 'SIIVA Bullet Time Local Server'};
        ret.status = RET_STATUS.SUCCESS;
        ret.result = result;

        res.status(HttpStatus.OK).json(ret);
    }
}

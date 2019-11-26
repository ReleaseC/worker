import { Controller, Get, Res, Query, HttpStatus } from '@nestjs/common';
import { RetObject, CODE_VALUE } from '../common/ret.component';

@Controller('system')
export class SystemController {
    constructor() { }

    /**
     * @api {get} /system/version Get version info
     * @apiName version
     * @apiGroup system
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "code": 1,
     *          "result": {
     *              "version": "1.0"
     *          }
     *      }
     *  */
    @Get('version')
    async version(@Res() res) {
        let ret = new RetObject();
        ret.code = CODE_VALUE.SUCCESS;
        ret.result = { 'version': '1.0' }
        res.status(HttpStatus.OK).json(ret);
    }
}

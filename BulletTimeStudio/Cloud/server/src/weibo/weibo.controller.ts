import { Controller, Get, HttpStatus, Query, Res } from "@nestjs/common";
import { WeiboService } from "./weibo.service";


@Controller("weibo")
export class WeiboController {
  constructor(private readonly weiboService: WeiboService) {
  }

  @Get('get_weibo')
  async get_weibo(@Res() res, @Query() query) {
    let ret = await this.weiboService.getWeibo(query);
    console.log(` get weibo >>>>`);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

}
import { Body, Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AuthService } from "./auth.service";
import { RetObject } from "../common/ret.component";

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService) { }

  /**
   * @api {post} /account/login Confirm Cloud/admin login
   * @apiVersion 1.1.0
   * @apiName login 
   * @apiGroup account
   *
   * @apiParam {String} account Login account
   * @apiParam {String} password Login password
   *
   * @apiSuccess {String} expires_in  expire time of the user
   * @apiSuccess {String} access_token access token of the user
   *
   * @apiError {Object} ret
   * @apiError {Number} ret.code 1
   *
   *
   * @apiError (500) {Object} error Show error INTERNAL_SERVER_ERROR
   * 
  */
  @Post('login')
  async login(@Res() res, @Body('account') account: string, @Body('password') password: string) {
    try {
      let ret = await this.accountService.login(account, password);
      let status = HttpStatus.FORBIDDEN;
      let accessToken = {};

      // console.log("account.controller.ts >>> ret [start]");
      // console.log(ret);
      // console.log("account.controller.ts >>> ret [end]");
      if (ret !== null) {
        status = HttpStatus.OK;
        accessToken = await this.authService.createToken(account);
        accessToken["siteId"] = ret["siteId"];
        accessToken["group"] = ret["group"];
      } else {
        console.log("account.controller.ts >>> ret is null");
        ret = new RetObject();
        ret.code = 1;
      }

      res.status(status).json(!!Object.keys(accessToken).length ? accessToken : ret);
    } catch (e) {
      console.log('/account/login e=' + e);
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json(e);
    }
  }

  /**
   * @api {get} /account/logout Confirm Cloud/admin logout
   * @apiVersion 1.1.0
   * @apiName logout 
   * @apiGroup account
   *
   * @apiParam {String} accessToken User accessToken
   *
   * @apiSuccess {String} string return "Logout successful"
   */
  @Get('logout')
  async logout(@Res() res, @Query('accessToken') token: string) {
    res.status(HttpStatus.OK).json('Logout successful');
  }

  /**
   * @api {post} /account/add_user Add user account into cloud database
   * @apiVersion 1.1.0
   * @apiName add_user
   * @apiGroup account
   *
   * @apiParam {String} account user account
   * @apiParam {String} password user password
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return "add_user save success"
   * 
   */
  @Post('add_user')
  async add_user(
      @Res() res, 
      @Body('account') account: string, 
      @Body('password') password: string
  ){
    let ret = await this.accountService.add_user(account, password);
    res.status(HttpStatus.OK).json(ret);
  }
  
  /**
   * @api {get} /account/get_account_list Get account list 
   * @apiVersion 1.1.0
   * @apiName get_user_list
   * @apiGroup account
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return account lists
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description "No accounts"
   * 
   */
  @Get('get_account_list')
  async get_account_list(@Res() res) {
    let ret = await this.accountService.get_account_list();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /account/get_soccer_account Get soccer account list 
   * @apiVersion 1.0.0
   * @apiName get_soccer_account
   * @apiGroup account
   *
   * @apiSuccess {Object} ret return Accounts
   * 
   */
  @Get('get_soccer_account')
  async get_soccer_account(@Res() res) {
    let ret = await this.accountService.accountList();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /account/soccerLogin Mobile login soccer accont 
   * @apiVersion 1.0.0
   * @apiName soccerLogin
   * @apiGroup account
   *
   * @apiParam {String} account user account
   * @apiParam {String} password user password
   * @apiParam {String} deviceId deviceId
   *
   * @apiSuccess {String} accessToken return accessToken
   * 
   */
  @Post('soccerLogin')
  async soccerLogin(@Res() res, @Body('account') acc: string, @Body('password') password: string, @Body('deviceId') deviceId: string) {
    try {
      let account = await this.accountService.findOne(acc, password, deviceId);
      let status = HttpStatus.FORBIDDEN;
      let accessToken = {};
      if (account && account['password'] == password) {
        status = HttpStatus.OK;
        accessToken = await this.authService.createToken(acc);
        console.log('accessToken='+JSON.stringify(accessToken));
      }
      res.status(status).json(accessToken);
    }
    catch (e) {
      console.log(e);
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json(e);
    }
  }

  /**
   * @api {get} /account/soccerLogout Mobile logout soccer accont 
   * @apiVersion 1.0.0
   * @apiName soccerLogout
   * @apiGroup account
   *
   * @apiParam {String} accessToken user accessToken
   *
   * @apiSuccess {String} string return "Soccer logout"
   * 
   */
  @Get('soccerLogout')
  async soccerLogout(@Res() res, @Query('accessToken') token: string) {
    // expire token
    res.status(HttpStatus.OK).json('Soccer logout');
  }

  // -------------------------- V2 Account CRUD -----------------------------
  /**
   * @api {post} /account/v2/account_register Create cloud admin account
   * @apiVersion 1.1.0
   * @apiName account_register
   * @apiGroup account/v2/
   *
   * @apiParam {Object} data register data object
   * @apiParam {String} data.account user account
   * @apiParam {String} data.password user password
   * @apiParam {Object} data.role user role
   * @apiParam {Array} data.role.admin manage some siteIds as admin
   * @apiParam {Array} data.role.owner manage some siteIds as owner
   * @apiParam {Array} data.role.siteAdmin manage some siteIds as siteAdmin
   * @apiParam {String} data.desc user description
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return "register success"
   * 
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description return fail description
   */
  @Post('v2/account_register')
  async account_register(@Res() res, @Body() data) {
    let ret = await this.accountService.register(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /account/v2/account_getlists Get account list
   * @apiVersion 1.1.0
   * @apiName account_getlists
   * @apiGroup account/v2/
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return account lists
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description "No accounts"
   * 
   */
  @Get('v2/account_getlists')
  async account_getlists(@Res() res, @Query() query) {
    let ret = await this.accountService.get_account_lists(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /account/v2/account_getInfo Get account info 
   * @apiVersion 1.1.0
   * @apiName account_getInfo
   * @apiGroup account/v2/
   *
   * @apiParam {String} account user account
   * @apiParam {String} accesstoken user accesstoken
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return account lists
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description "No accounts"
   * 
   */
  @Get('v2/account_getInfo')
  async account_getInfo(@Res() res, @Query() query) {
    let ret = await this.accountService.get_account_info(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /account/v2/account_matchSites Match account with siteId
   * @apiVersion 1.1.0
   * @apiName account_matchSites
   * @apiGroup account/v2/
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.description return "Update matchSites successful"
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description "No accounts"
   * 
   */
  @Post('v2/account_matchSites')
  async account_matchSites(@Res() res, @Body() data) {
    console.log('v2/account_matchSites data=' + JSON.stringify(data));
    let ret = await this.accountService.accountMatchSite(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /account/v2/account_delete Make account to inactive
   * @apiVersion 1.1.0
   * @apiName account_delete
   * @apiGroup account/v2/
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return account lists
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 1
   * @apiSuccess {String} ret.description "No accounts"
   * 
   */
  @Post('v2/account_delete')
  async account_delete(@Res() res, @Body() data) {
    let ret = await this.accountService.deleteAccount(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /account/v2/getSites Get siteId and siteName by accessToken
    * @apiVersion 1.1.0
    * @apiName getSites 
    * @apiGroup account/v2/
    *
    * @apiParam {String} account user account
    * @apiParam {String} type user account (BT/Soccor/Basketball)
    * @apiParam {String} access_token user access_token
    * 
    * @apiSuccess {Array} siteNameArr return siteName Array
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {String} ret.description error description
    * 
    */
   @Get('v2/getSites')
   async getSites(@Res() res, @Query() query) {
       const ret = await this.accountService.getSites(query);
       res.status(HttpStatus.OK).json(ret);
   }

   /**
    * @api {get} /account/v2/getGroupArray Get groupArray by accessToken
    * @apiVersion 1.1.0
    * @apiName getGroupArray 
    * @apiGroup account/v2/
    *
    * @apiParam {String} account user account
    * @apiParam {String} access_token user access_token
    * @apiParam {String} type user type
    * 
    * @apiSuccess {Array} groupArray return group site setting
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {String} ret.description error description
    * 
    */
   @Get('v2/getGroupArray')
   async getGroupArray(@Res() res, @Query() query) {
       const ret = await this.accountService.getGroupArray(query);
       res.status(HttpStatus.OK).json(ret);
   }

   /**
    * @api {get} /account/v2/get_groups Get groups by accessToken
    * @apiVersion 1.1.0
    * @apiName get_groups 
    * @apiGroup account/v2/
    *
    * @apiParam {String} account user account
    * @apiParam {String} access_token user access_token
    * 
    * @apiSuccess {Object} ret
    * @apiSuccess {Number} ret.code 0
    * @apiSuccess {Object} ret.result 
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {String} ret.description error description
    * 
    */
   @Get('v2/get_groups')
   async get_groups(@Res() res, @Query() query) {
       let ret = await this.accountService.getGroups(query);
       res.status(HttpStatus.OK).json(ret);
   }


  /**
   * @api {get} /account/v2/get_siteIds 根据accessToken获取该账户下所有的siteId
   * @apiVersion 1.0.0
   * @apiName get_siteIds
   * @apiGroup account/v2/
   * 
   * @apiParam {String} accessToken
   * 
   * @apiSuccess {Object} ret
   * @apiSuccess {Object} ret.result
   * 
   * @apiError {Object} ret
   * @apiError {String} ret.description
   *  
   */
  @Get('v2/get_siteIds')
  async get_siteIds(@Res() res, @Query() query) {
    let ret = await this.accountService.getSiteIds(query);
    res.status(HttpStatus.OK).json(ret);
  }

   
}

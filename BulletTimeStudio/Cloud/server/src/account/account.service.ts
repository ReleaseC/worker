import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { Model } from 'mongoose';
import { ACCOUNT_ROLE, Account } from './interface/account';
import { accountdb } from '../common/db.service';
import { RetObject } from '../common/ret.component';
import { accMatchSigDb } from '../common/db.service';
import { AuthService } from './auth.service';
import { SiteService } from '../site/site.service';
import { dbTools } from '../common/db.tools';
import { RedisService } from '../common/redis.service';
import tools from "../common/tools";
const authService = new AuthService();
const siteService = new SiteService();
var crypto = require('crypto');

// ToDo: Prepare to delete it
let Accounts = [
    { name: "siiva", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "hellokitty", password: "bb536b2e0f18d7bf37e112d1c2a8b72c", group: ACCOUNT_ROLE.GROUP_CUSTOMER },
    { name: "soccer_test", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "soccer_test_1", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "soccer_test_2", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "soccer_test_3", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "soccer_test_4", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "soccer_test_5", password: "7a05d1a0a575f7df313f4597e4d608f1", group: ACCOUNT_ROLE.GROUP_ADMIN }, // ToDo: only for soccor test
    { name: "sh_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Shanghai 淺水灣
    { name: "sh_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Shanghai 麵包樹
    { name: "sh_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Shanghai 2361
    { name: "sh_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Shanghai 番茄
    { name: "bj_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂一
    { name: "bj_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂二
    { name: "bj_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂三
    { name: "bj_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂四
    { name: "bj_5", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂五
    { name: "bj_6", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 觀音堂六
    { name: "bj_7", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 四德一
    { name: "bj_8", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Beijing 四德二
    { name: "gz_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 龍燁一
    { name: "gz_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 龍燁二
    { name: "gz_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 龍燁三
    { name: "gz_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 球經一
    { name: "gz_5", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 球經二
    { name: "gz_6", password: "bb6a4e31e039e1a12c3b8958dd117503", group: ACCOUNT_ROLE.GROUP_ADMIN }, // Guangzhou 球經三
];


@Component()
export class AccountService {

    async login(account: string, password: string) {
        console.log('AccountService.login, account=' + account);
        let md5 = crypto.createHash('md5');
        let result = md5.update(password).digest('hex');

        console.log(">>>> login >>> password");
        console.log(result);
        // this operation is not correct, the account should not be 'name' field.
        // let ret_account = await accountdb.findOne({ "name": account, "password": result });
        let ret_account = await accountdb.findOne({account, password: result}) || await accountdb.findOne({ "name": account, "password": result });
        return ret_account;
    }

    async add_user(account: string, password: string) {
        let ret: RetObject = new RetObject;
        let md5 = crypto.createHash('md5');
        let result = md5.update(password).digest('hex');
        let accountDb = new accountdb({ "account": account, "password": result});
        accountDb.save();
        ret.code = 0;
        ret.description = "add_user save success";
        return ret;
    }

    async get_account_list() {
        let ret: RetObject = new RetObject;
        var account = await accountdb.find({}, {account:1});
        if (account !== null) {
            ret.code = 0;
            ret.result = account;
        }else{
            ret.code = 1;
            ret.description = "No accounts";
        }
        return ret;
    }

    // ToDo: Prepare to delete it
    async accountList(){
        return Accounts;
    }

    // ToDo: Prepare to delete it
    async findOne(name: string, password: string, deviceId: string) {
        let account = null;
        let accounts = Accounts.filter(account => account.name == name);
        if (accounts.length > 0) {
            account = accounts[0];
        }
        // console.log('account.service findOne: ' + name + ', ' + password + ' => ' + account);

        await accMatchSigDb.findOne({'account': name}, async (err, account) => {
            if(err){
                console.log('accMatchSigDb err='+err);
            }else{
                if(account){
                    account.signature = deviceId;
                    account.save();
                }else{
                    let newAcc = new accMatchSigDb();
                    newAcc.account = name;
                    newAcc.signature = deviceId;
                    newAcc.save();
                }
            }
        });

        return account;
    }

    // -------------------------- V2 Account CRUD -----------------------------
    async register(data) {
        let ret: RetObject = new RetObject;
        console.log('data=' + JSON.stringify(data));
        let md5 = crypto.createHash('md5');
        let pass_hex = md5.update(data.password).digest('hex');

        ret = await authService.authAccessToken(data.access_token);
        if (ret.code != 0){
            return ret;
        }

        let result = await accountdb.find({"account": data.account});
        if(result.length){
            ret.code = 1;
            ret.description = "This account is exists";
            return ret;
        }else{
            let accountDb = new accountdb({ 
                "account": data.account, // for v2
                "name": data.account, // for v1
                "password": pass_hex,
                "role": data.role,
                "active": true,
                "description": data.description,
            });
            return accountDb.save()
            .then(() => {
                ret.code = 0;
                ret.description = "register save success";
                return ret;
            })
            .catch(err => {
                ret.code = 0;
                ret.result = err;
                return ret;
            });
        }
    }

    async get_account_lists(query) {
        let ret: RetObject = new RetObject;

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0){
            return ret;
        }

        var account = await accountdb.find({"active":true}, {account:1, role:1, description:1, matchSites:1});
        if (account.length) {
            ret.code = 0;
            ret.result = account;
        }else{
            ret.code = 1;
            ret.description = "No accounts";
        }
        return ret;
    }

    async get_account_info(query) {
        let ret: RetObject = new RetObject;

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0){
            return ret;
        }

        var result = await accountdb.findOne({"account": query['account']}, {account:1, role:1, description:1, matchSites:1, groups:1});
        if (result) {
            ret.code = 0;
            ret.result = result;
        }else{
            ret.code = 1;
            ret.description = "No accounts";
        }
        return ret;
    }

    async accountMatchSite(data) {
        let ret: RetObject = new RetObject;

        ret = await authService.authAccessToken(data.access_token);
        if (ret.code != 0){
            return ret;
        }

        let account = await accountdb.findOne({"account": data.account});
        if (account) {
            await accountdb.findOne({"account": data.account, "matchSites.matchSiteName": data.matchSiteName}, async (err, result) => {
                if(result){
                    for(let i = 0; i < result.matchSites.length; i++){
                        if(result.matchSites[i].matchSiteName === data.matchSiteName){
                            result.matchSites[i].matchSiteLists = data.matchSiteLists;
                            await result.update({"matchSites": result.matchSites});
                            break;
                        }
                    }
                }else{
                    const matchData = {
                        "matchSiteName": data.matchSiteName,
                        "matchSiteLists": data.matchSiteLists,
                    }

                    if(!account.matchSites) account.matchSites = [];
                    account.matchSites.push(matchData);
                    await account.save();
                }
            });
            ret.code = 0;
            ret.description = "Update matchSites successful";
        }else{
            ret.code = 1;
            ret.description = "No accounts";
        }
        return ret;
    }

    async deleteAccount(data) {
        let ret: RetObject = new RetObject;

        ret = await authService.authAccessToken(data.access_token);
        if (ret.code != 0){
            return ret;
        }

        let result = await accountdb.update({"account": data.account}, { $set: { "active": false } });
        console.log('result=' + JSON.stringify(result));
        if(result.ok){
            ret.code = 0;
            ret.description = "Delete successful.";
        } else {
            ret.code = 1;
            ret.description = "Delete failed.";
        }
        return ret;
    }

    getAccountMatchSitesData(data, type){
        const dataLen = data.length;
        console.log('dataLen=' + dataLen);
        for(let i = 0; i < dataLen; i++){
            if(data[i].matchSiteName.toUpperCase() === type.toUpperCase()){
                return data[i];
            }
        }
        return null;
    }
    
    async getSites(query){
        let ret: RetObject = new RetObject;
        let siteNameArr = [];

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0){
            return siteNameArr;
        }

        let accountApiResult = await this.get_account_info(query);
        // console.log('accountApiResult0 = ' + JSON.stringify(accountApiResult));
        
        if(accountApiResult.code != 0) {
            return siteNameArr;
        }

        accountApiResult = this.getAccountMatchSitesData(accountApiResult.result['matchSites'], query.type);
        // console.log('accountApiResult1 = ' + JSON.stringify(accountApiResult));
        if(accountApiResult != null){
            ret.code = 0;
            ret.result = accountApiResult;
        }else{
            ret.code = 1;
            ret.result = 'No such data on type ' + query.type;
            return siteNameArr;
        }
        
        let matchSiteListsLen = accountApiResult['matchSiteLists'].length;
        for(let i = 0; i < matchSiteListsLen; i++){
            let  data = {
                "type": query.type,
                "siteId": accountApiResult['matchSiteLists'][i],
                "access_token": query['access_token']
            };
            let siteApiResult = await siteService.getSiteSettingInfo(data);
            // console.log('siteApiResult=' + JSON.stringify(siteApiResult));
            if(siteApiResult.code == 0){
                siteNameArr.push({
                    "siteId": accountApiResult['matchSiteLists'][i],
                    "siteName": siteApiResult.result['siteName'],
                });
            }else{
                ret.code = siteApiResult.code;
                ret.result = siteApiResult.description;
                return siteNameArr;
            }
        }
        
        // ret.code = 0;
        // ret.result = siteNameArr;
        return siteNameArr;
    }

    async getGroupArray(query){
        let ret: RetObject = new RetObject;
        let groupArray = [];

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0){
            return groupArray;
        }

        let accountApiResult = await this.get_account_info(query);
        // console.log('accountApiResult = ' + JSON.stringify(accountApiResult));
        
        if(accountApiResult.code != 0) {
            return groupArray;
        }

        const groupArrayLen = accountApiResult.result['groups'].length;
        // console.log('groupArrayLen=' + groupArrayLen);
        for(let i = 0; i < groupArrayLen; i++){
            query.group = accountApiResult.result['groups'][i]
            let result = await siteService.getSiteSetting(query);
            if(result['result'] === undefined) continue;
            // console.log('result=' + Object.keys(result['result']).length);
            
            for(let j = 0; j < Object.keys(result['result']).length; j++){
                // console.log('siteId=' + result['result'][j].siteId);
                groupArray.push(result['result'][j]);
            } 
        }
        
        // ret.code = 0;
        // ret.result = siteNameArr;
        return groupArray;
    }

    async getGroups(query) {
        let ret: RetObject = new RetObject;

        try {
            // todo access token validate

            ret.result = await accountdb.findOne({account: query.account}, {groups: 1, _id: 0});
            ret.code = ret.result ? 0 : 1;
        } catch (error) {
            ret.code = 2;
            ret.description = `获取分组失败: ${error}`;
        }
        return ret;
    }


    async getSiteIds(query) {
        let ret: RetObject = new RetObject;

        try {
            if ( !query.accessToken ) { throw new Error(`access token 无效： ${query.accessToken}`); }
            
            let cacheData = await RedisService.getCache(query.accessToken); console.log(`cacheData: `); console.log(cacheData);
            let cacheDataObj = JSON.parse(cacheData); console.log(`cacheDataObj >>> `); console.log(cacheDataObj);
            let account = cacheDataObj['account'];

            if ( !account ) { throw new Error(`account 无效： ${cacheDataObj['account']}`); }
            
            ret.result = await accountdb.findOne({account}, {role: 1});
            ret.code = ret.result ? 0 : 1;
            ret.code === 0 && (ret.result = this.filterRole(ret.result['role']));
        } catch (error) {
            ret.code = 2;
            ret.description = `获取siteIds失败： ${error}`;
        }

        return ret;
    }

    // role: {admin: Array, owner: Array, siteAdmin: Array}
    filterRole(role): Array<string> {
        return tools.isValidArray(role.admin) ||
          tools.isValidArray(role.owner) ||
          tools.isValidArray(role.siteAdmin) ||
          [];
    }


}

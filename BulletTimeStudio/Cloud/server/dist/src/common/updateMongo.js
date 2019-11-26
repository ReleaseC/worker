"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = require("../common/db.service");
function updateAccountDb() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret_account = yield db_service_1.accountdb.update({}, { $set: { "groups": "nike2018" } }, { multi: true });
        console.log('ret_account=' + JSON.stringify(ret_account));
        return ret_account;
    });
}
function pushAccountDb() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret_account = yield db_service_1.accountdb.update({}, { $push: { "groups": "basketball" } }, { multi: true });
        console.log('ret_account=' + JSON.stringify(ret_account));
        return ret_account;
    });
}
function updateSoccorDb() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret_account = yield db_service_1.soccorDbSiteSetting.update({ "siteType": "BASKETBALL" }, { $set: { "group": "basket_test" } }, { multi: true });
        console.log('ret_account=' + JSON.stringify(ret_account));
        return ret_account;
    });
}
function pushSoccorDb() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret_account = yield db_service_1.soccorDbSiteSetting.update({ "siteType": "BASKETBALL" }, { $push: { "group": "basket_test" } }, { multi: true });
        console.log('ret_account=' + JSON.stringify(ret_account));
        return ret_account;
    });
}
function formatSiteSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`process env = ${process.env.NODE_ENV}`);
        yield db_service_1.siteSettingModel.update({}, {
            $rename: {
                template: "templates",
                type: "siteType",
                name: "siteName",
                group: "groups"
            }
        }, { multi: true }, function (err, raw) {
            if (err) {
                console.log("err >>>>>>>>>");
                console.log(err);
            }
            else if (raw) {
                console.log("raw >>>>>>>>>>");
                console.log(raw);
            }
            console.log("success");
        });
    });
}
function insertBaskerPlayerDb() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("insertBaskerPlayerDb");
        let basketAnnoDb = new db_service_1.basketAnnoSiteSettingSchema({
            siteId: "67890",
            siteName: "測試球場2",
            player: [
                {
                    name: "player1",
                    team: "team3",
                },
                {
                    name: "player2",
                    team: "team3",
                },
                {
                    name: "player3",
                    team: "team3",
                },
                {
                    name: "player4",
                    team: "team3",
                },
                {
                    name: "player5",
                    team: "team3",
                },
                {
                    name: "player1",
                    team: "team4",
                },
                {
                    name: "player2",
                    team: "team4",
                },
                {
                    name: "player3",
                    team: "team4",
                },
                {
                    name: "player4",
                    team: "team4",
                },
                {
                    name: "player5",
                    team: "team4",
                },
            ],
        });
        basketAnnoDb.save();
        return;
    });
}
insertBaskerPlayerDb();
//# sourceMappingURL=updateMongo.js.map
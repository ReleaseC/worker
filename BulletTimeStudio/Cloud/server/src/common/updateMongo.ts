import * as async from "async";
import {
    accountdb,
    soccorDbSiteSetting,
    siteSettingModel,
    basketAnnoSiteSettingSchema,
    commercialTextDb,
    commercialVideoDb,
    commercialAudioDb
} from '../common/db.service';

async function updateAccountDb() {
    let ret_account = await accountdb.update({}, { $set: { "groups": "nike2018" } }, { multi: true });
    console.log('ret_account=' + JSON.stringify(ret_account));
    return ret_account;
}

async function pushAccountDb() {
    let ret_account = await accountdb.update({}, { $push: { "groups": "basketball" } }, { multi: true });
    console.log('ret_account=' + JSON.stringify(ret_account));
    return ret_account;
}

async function updateSoccorDb() {
    let ret_account = await soccorDbSiteSetting.update({ "siteType": "BASKETBALL" }, { $set: { "group": "basket_test" } }, { multi: true });
    console.log('ret_account=' + JSON.stringify(ret_account));
    return ret_account;
}

async function pushSoccorDb() {
    let ret_account = await soccorDbSiteSetting.update({ "siteType": "BASKETBALL" }, { $push: { "group": "basket_test" } }, { multi: true });
    console.log('ret_account=' + JSON.stringify(ret_account));
    return ret_account;
}

async function formatSiteSettings() {
    console.log(`process env = ${process.env.NODE_ENV}`);
    await siteSettingModel.update({}, {
        $rename: {
            template: "templates",
            type: "siteType",
            name: "siteName",
            group: "groups"
        }
    }, {multi: true}, function (err, raw) {
        if (err) {
            console.log("err >>>>>>>>>")
            console.log(err);
        } else if (raw) {
            console.log("raw >>>>>>>>>>");
            console.log(raw);
        }
        console.log("success");

    });
}

async function insertBaskerPlayerDb() {
    console.log("insertBaskerPlayerDb");
    let basketAnnoDb = new basketAnnoSiteSettingSchema({
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
}

async function insertCommercialTextDb() {
    console.log("insertCommercialTextDb");
    let textDb = new commercialTextDb({
        comercialTextObj: 
            {
                "title": "Template",
                "description": `親愛的[張三先生]您好
                您在[2018]年的資產總共增加了[1000]萬台幣
                您在下個年度將會被升級為[財富管理由]專業理財團隊提供您專屬的諮詢服務與精闢市場資訊
                您目前信用卡的累積里程為[115,000浬]再累績[85,000浬]即可兌換[台北到上海來回機票]
                `
            }
    });
    textDb.save();
    return;
}

async function insertCommercialVideoDb() {
    console.log("insertCommercialVideoDb");
    let videoDb = new commercialVideoDb({
        comercialVideoObj: 
            {
                "title": "Template",
                "videoName": "VideoTemplate.mp4",
            }
    });
    videoDb.save();
    return;
}

async function insertCommercialAudioDb() {
    console.log("insertCommercialAudioDb");
    let audioDb = new commercialAudioDb({
        comercialAudioObj: 
            {
                "title": "Template",
                "audioName": "commercialAudioTemplate.mp4",
            }
    });
    audioDb.save();
    return;
}

// formatSiteSettings();
// updateAccountDb();
//pushAccountDb();
//updateSoccorDb();
//pushSoccorDb();
insertCommercialTextDb();
insertCommercialVideoDb();
// insertCommercialAudioDb();

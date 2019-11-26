import { RetObject } from '../common/ret.component';
import {
    commercialTextDb,
    commercialVideoDb,
    commercialAudioDb
} from '../common/db.service';

export class CustomizeService {
    async getTextTemplate() {
        let ret: RetObject = new RetObject;
        let retArr = [];
        let textResult = await commercialTextDb.find();
        for(let i = 0; i < textResult.length; i++){
            retArr.push(textResult[i].comercialTextObj);
        }
        ret.code = 0;
        ret.result = retArr;
        return ret;
    }

    async getVideoTemplate() {
        let ret: RetObject = new RetObject;
        let retArr = [];
        let videoResult = await commercialVideoDb.find();
        for(let i = 0; i < videoResult.length; i++){
            retArr.push(videoResult[i].comercialVideoObj);
        }
        ret.code = 0;
        ret.result = retArr;
        return ret;
    }

    async getAudioTemplate() {
        let ret: RetObject = new RetObject;
        let retArr = [];
        ret.code = 0;
        let audioResult = await commercialAudioDb.find();
        for(let i = 0; i < audioResult.length; i++){
            retArr.push(audioResult[i].comercialAudioObj);
        }
        ret.code = 0;
        ret.result = retArr;
        return ret;
    }
}

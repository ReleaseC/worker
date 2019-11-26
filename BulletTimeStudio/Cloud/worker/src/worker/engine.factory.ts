import { IEngineFactory, TYPE } from '../common/worker.interface';
import { CutvideoService } from '../cutvideo/cutvideo.service';
import { RifleService } from '../cutvideo/rifle.service';
import { SoccerService } from '../cutvideo/soccer.service';
// import { AnnoToolService } from '../cutvideo/annotool.service';
// import { MomentVideoService } from '../cutvideo/moment.service';
import { BasketballService } from '../cutvideo/basketball.service';
import { SingleVideoService } from '../cutvideo/singleVideo.service';
import { CustomVideo } from '../cutvideo/customVideo.service';
import { MulticamService } from '../cutvideo/multicam.service';
import{CommonService}from '../cutvideo/common.service';
export class EngineFactory implements IEngineFactory {

    constructor() { }

    createFactory(type: string) {
        
        switch (type) {
            case TYPE.TYPE_BT:
                return new CutvideoService();

            case TYPE.TYPE_RIFLE:
                return new RifleService();

            case TYPE.TYPE_SOCCER:
                return new SoccerService();
                
            case TYPE.TYPE_1:
                return new SingleVideoService();

            case TYPE.TYPE_CUSTOMVIDEO:
                return new CustomVideo();
            
            case TYPE.TYPE_BASKETBALL:
                return new BasketballService();

            case TYPE.TYPE_MULTICAM:
                return new MulticamService();

            case TYPE.TYPE_COMMON:
                return new CommonService();

            default :
                return;
        }
    }

}
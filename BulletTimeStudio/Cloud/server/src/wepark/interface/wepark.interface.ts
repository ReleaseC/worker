import {Document} from 'mongoose';


export interface Wepark extends Document {
    gid: String,
    uid: String,
    fid: String,
    action: String,
    activity_id: String,
    timestamp: String,
    type: String,
    param: Object,
    create_time: String,

}

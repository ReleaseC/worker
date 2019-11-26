const mongoose = require("mongoose");
const db = mongoose.createConnection('mongodb://localhost/edge_server');
        
const loginMonSchema = new mongoose.Schema({
    'siteId': String,
    'accessToken': String,
});
export const loginCloudData = db.model('logins', loginMonSchema);


export enum DB_STATUS {
    FAIL = -1,
    OK = 0,
}
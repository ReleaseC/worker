const mongoose = require("mongoose");

const db = mongoose.createConnection('mongodb://localhost/edge_server');

export const discoverConfigSchema = new mongoose.Schema({
    apiServer: String,
    cameraIp: Object,
});

export const discoverConfig = db.model('discover_config', discoverConfigSchema);
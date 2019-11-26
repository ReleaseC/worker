var HttpRequest = require('ufile').HttpRequest;
var AuthClient = require('ufile').AuthClient;
var util = require('util');


var bucket = "siiva";
var key = "taipei_test_0412.mp4";
var file_path = 'assets/video/align/out.mp4';

var method = 'POST';
var url_path_params = '/' + key;


var req = new HttpRequest(method, url_path_params, bucket, key, file_path);

var client =  new AuthClient(req);

function callback(res) {
	if (res instanceof Error) {
		console.log(util.inspect(res));
	} else {
		console.log(util.inspect(res));
	}
}
client.SendRequest(callback);

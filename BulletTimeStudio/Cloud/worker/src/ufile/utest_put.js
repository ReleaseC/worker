var HttpRequest = require('ufile').HttpRequest;
var AuthClient = require('ufile').AuthClient;
var util = require('util');


var bucket = "siiva";
var key = "taipei_test_0412.mp4";
var file_path = 'assets/video/align/out.mp4';

var method = 'PUT';
var url_path_params = '/' + key;


var req = new HttpRequest(method, url_path_params, bucket, key, file_path);


//req.setHeader("Date", new Date().toString());
//req.setHeader("Content-MD5", "2aac9f65c9c908f1f601cc5d0b642bf0");

// req.setHeader("X-UCloud-Hello", "1234");
// req.setHeader("X-UCloud-World", "abcd");
// req.setHeader("X-UCloud-Hello", "3.14");


var client =  new AuthClient(req);

function callback(res) {
	if (res instanceof Error) {
		console.log(util.inspect(res));
	} else {
		console.log(util.inspect(res));
	}
}
client.SendRequest(callback);

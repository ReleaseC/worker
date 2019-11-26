var HttpRequest = require('ufile').HttpRequest;
var AuthClient = require('ufile').AuthClient;
var util = require('util');

var bucket = 'eee';
var key = "0001/adjust.xlx";
var file_path = 'adjust.xlsx';

var method = 'GET';
var url_path_params = '/' + key;


var req = new HttpRequest(method, url_path_params, bucket, key, file_path);

// req.setHeader("X-UCloud-Hello", "1234");
// req.setHeader("X-UCloud-World", "abcd");
// req.setHeader("X-UCloud-Hello", "3.14");

var client = new AuthClient(req);

async function boot() {
    const res = await client.SendRequest(() => { })
    console.log(res);

}
boot()
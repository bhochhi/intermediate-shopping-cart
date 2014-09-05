var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var qs = require('querystring');
var _  = require('lodash');
var root = __dirname;

var items = [];
var server = http.createServer(function (req, res) {


	if(req.url == '/' || req.url=='/index.html') {
		switch(req.method) {
			case 'GET':
				req.url = '/index.html';
				var url = parse(req.url);
				var path = join(root, url.pathname);
				fs.stat(path, function (err, stat) {
					if (err) {
						if (err.code == 'ENOENT') {
							res.statusCode = 404;
							res.end('File Not Found');
						}
						else {
							res.statusCode = 500;
							res.end('Internal Server Error');
						}
					}
					else {

						var stream = fs.createReadStream(path);
						res.setHeader('Content-Length', stat.size);
						stream.on('error', function (err) {
							res.statusCode = 500;
							res.end('Internal Server Error');
						});
						stream.pipe(res);	

					}
				});
				break;
			case 'POST':
				var item = '';
				req.setEncoding('utf8');
				req.on('data', function(chunk){					
					item += chunk;
				});
				req.on('end', function(){
					var obj = qs.parse(item);
					obj.id = items.length;
					items.push(obj);
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(items) );
				});
				break;
			case 'PUT':
				var item = '';
				req.on('data', function(chunk){					
					item += chunk;
				});
				req.on('end', function(){
					var obj = qs.parse(item);
					var tmpItems = _.map(items,function(itm){
						if(itm.id==obj.id){
							itm.item = obj.item;
						}
						return itm;
					});
					items = tmpItems;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(items) );
				});
				break;
			case 'DELETE':
				var item = '';
				req.on('data', function(chunk){					
					item += chunk;
				});
				req.on('end', function(){
					var obj = qs.parse(item);
					var tmpItems = _.map(items,function(itm){
						if(itm.id==obj.id){
							itm.deleted = true;
						}
						return itm;
					});
					items = tmpItems;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(items) );
				});
				break;
		}
	}
	else{
		var url = parse(req.url);
		var path = join(root, url.pathname);
		fs.stat(path, function (err, stat) {
			if (err) {
				if (err.code == 'ENOENT') {
					res.statusCode = 404;
					res.end('File Not Found');
				}
				else {
					res.statusCode = 500;
					res.end('Internal Server Error');
				}
			}
			else {

				var stream = fs.createReadStream(path);
				res.setHeader('Content-Length', stat.size);
				stream.on('error', function (err) {
					res.statusCode = 500;
					res.end('Internal Server Error');
				});
				if(req.url.indexOf('.js')>-1){
					res.setHeader('Content-Type','text/javascript');
				}
				stream.pipe(res);	
			}
		});	
	}
});


server.listen(9000, function(){
	console.log('listening on 9000');
});
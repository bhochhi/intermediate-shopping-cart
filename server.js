var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var qs = require('querystring');
var root = __dirname;
var items = [];
var counter = 0;
var url = require('url');

var server = http.createServer(function(req, res){

  function okStatusHeader() {
    res.writeHead(200, {'Content-Type': 'text/html'});  
  }

  function newItemForm() {
    res.write('<form action="/" method="post"><input type="text" name="item" placeholder="Enter an item"><button>Add Item</button></form>'); 
  }

  function showList() {
    var myList = '';
    items.forEach(function(item, i){
      myList += (i + '. ' + item.name + '<br><form action="/" method="put"><input type="text" name=' + i + '><button>Update</button></form>');
    });
    res.write('<div>' +  myList + '</div>');
  }

  if(req.url == '/') {
    switch(req.method) {
      case 'GET':
        okStatusHeader();
        newItemForm();
        showList();
        res.end();
      break;
      case 'POST':
        var item = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){
          item += chunk;
        });
        req.on('end', function(){
          okStatusHeader();
          items.push({'id': counter, 'name': qs.parse(item).item});
          counter++;
          newItemForm();
          showList();
          console.log(items);
          res.end();
        });
      break;
      case 'PUT':
        var k = '';
        var pathname = url.parse(req.url).pathname;
        var j = pathname.slice(1);
        req.on('data', function(chunk){
          k += chunk;
        }); 
        req.on('end', function(){
          console.log(k);
          // items[j].name = k;
          // newItemForm();
          // showList();
        }); 
    }
  }
});

server.listen(9000, function() {
  console.log('Listening on port 9000.')
});
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var qs = require('querystring');
var root = __dirname;
var items = [];

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
      myList += (i + '. ' + item + '<br><form action="/" method="put"><input type="text" name="edited-item"><button>Update</button></form>');
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
          items.push(qs.parse(item).item);
          newItemForm();
          showList();
          res.end();
        });
      break;
      case 'PUT':
        var j ='';
        req.on('data', function(chunk){
          j += chunk;
        }); 
        req.on('end', function(){
          console.log('done');
        }); 
    }
  }
});

server.listen(9000, function() {
  console.log('Listening on port 9000.')
});
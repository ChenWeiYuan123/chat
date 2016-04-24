var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');
var cache  = {};

function send404(response){
	response.writeHead(404,{'Content-Type':'text-plain'});
	response.write('Error 404:resource not found.');
	response.end();
}

function sendFile(response,filePath,fileContents){
	response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

function serverStatic(response,cache,absPath){
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath]);//从内存中返回文件
	}else{
		fs.exists(absPath,function(exists){
			if(exists){
				fs.readFile(absPath,function(err,data){//从硬盘中读取文件
					if(err){
						send404(response);
					}else{
						cache[absPath]=data;
						sendFile(response,absPath,data);//读取文件并返回
					}
				});
			}else{
				send404(response);
			}
		});
	}
}

   
	

var server=http.createServer(function (request, response) {
  var filePath = false; 
  if(request.url == '/'){
  	filePath = 'public/index.html';
  }else{
  	// var reHtmlAll=/.+\.html|.+\.css|.+\.js|.+\.pdf|.+\.png|.+\.jpg|/
  	var reHtmlAll1=/.+\?/
  	var reHtmlAll2=/[^\?]+/
  	if(reHtmlAll1.test(request.url))
  	newUrl=reHtmlAll2.exec(reHtmlAll1.exec(request.url)[0])//delete the ?attr=val
  	else{
  		newUrl=request.url
  	}
  	filePath = 'public'+newUrl;
  }
  var absPath='./'+filePath;
  serverStatic(response,cache,absPath);
});

server.listen(8000,function(){
	console.log('Server running at http://127.0.0.1:8000/');
});

chatServer.listen(server)
 


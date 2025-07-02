const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Привет, Октагон!</h1>');
}).listen(3000, "127.0.0.1",function(){;
   console.log("Сервер начал прослушивание запросов на порту 3000");
});
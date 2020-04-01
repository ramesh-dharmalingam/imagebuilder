var fabric = require('fabric').fabric, // or import { fabric } from 'fabric';
  http = require('http'),
  url = require('url'),
  PORT = 8124;

var server = http.createServer(function (request, response) {
  var params = url.parse(request.url, true);
  var canvas = new fabric.StaticCanvas(null, { width: 1200, height: 1200 });

  response.writeHead(200, { 'Content-Type': 'image/png' });

  canvas.loadFromJSON(params.query.data, function () {

    if (params.query.horizontal == "true") {
      var group = new fabric.Group(canvas.getObjects());
      group.rotate(270);
      canvas.centerObject(group);
      group.setCoords();
    }

    canvas.renderAll();

    var stream = canvas.createPNGStream();
    stream.on('data', function (chunk) {
      response.write(chunk);
    });
    stream.on('end', function () {
      response.end();
    });
  });
});

server.listen(PORT, () => console.log(`Image Services (nodejs) listening on port ${PORT}...`));
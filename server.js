var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var js2xmlparser = require("js2xmlparser");
var xslt = require('node_xslt');
var async = require('async');
var socketio = require('socket.io');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

// GET request to send back JSON file
router.get('/get/json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var obj = JSON.parse(fs.readFileSync('OnlineEnquiry.json', 'utf8'));
  console.log("test");
  res.end(JSON.stringify(obj));
});

//HTML Produced by XSL Transformation
router.get('/PartTimeCourses.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('PartTimeCourses.xsl');
  var doc=xslt.readXmlFile('PartTimeCourses.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

//HTML Produced by XSL Transformation
router.get('/FullTimeCourses.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('FullTimeCourses.xsl');
  var doc=xslt.readXmlFile('FullTimeCourses.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

//HTML Produced by XSL Transformation
router.get('/PostgraduateCourses.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('PostgraduateCourses.xsl');
  var doc=xslt.readXmlFile('PostgraduateCourses.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

//HTML Produced by XSL Transformation
router.get('/UndergraduateCourses.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('UndergraduateCourses.xsl');
  var doc=xslt.readXmlFile('UndergraduateCourses.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

//HTML Produced by XSL Transformation
router.get('/CaoCourses.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('CaoCourses.xsl');
  var doc=xslt.readXmlFile('CaoCourses.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

//HTML Produced by XSL Transformation
router.get('/OnlineEnquiry.html', function(req, res){
  
  //Read XML and XSL files
  var stylesheet=xslt.readXsltFile('OnlineEnquiry.xsl');
  var doc=xslt.readXmlFile('OnlineEnquiry.xml');
  //Transformation
  var result=xslt.transform(stylesheet, doc, []);
  //Creating the result
  res.send(result);
});

// POST request to add to JSON & XML files
router.post('/post/json', function(req, res) {
  // Function to read in a JSON file, add to it & convert to XML
  function appendJSON(obj) {
    // Read in a JSON file
    var JSONfile = fs.readFileSync('OnlineEnquiry.json', 'utf8');
    // Parse the JSON file in order to be able to edit it 
    var JSONparsed = JSON.parse(JSONfile);
    // Add a new record into the array within the JSON file    
    JSONparsed.order.push(obj);
    // Beautify the resulting JSON file
    var JSONformated = JSON.stringify(JSONparsed, null, 4);
    // Write the updated JSON file back to the system 
    fs.writeFileSync('OnlineEnquiry.json', JSONformated);
    // Convert the updated JSON file to XML     
    var XMLformated = js2xmlparser("enquiries", JSONformated);
    // Write the resulting XML back to the system
    fs.writeFileSync('OnlineEnquiry.xml', XMLformated);
  }
  // Call appendJSON function and pass in body of the current POST request
  appendJSON(req.body);
  // Re-direct the browser back to the page, where the POST request came from
  res.redirect('back');
});





io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
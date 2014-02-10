
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();
var utils = require('./server/utils.js');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.compress());
app.use(express.favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/share-your-voice', routes.share_your_voice);

app.post('/1.0/shared', routes.shared);
app.post('/1.0/power-share', routes.powershare);
app.post('/1.0/reward-seen', routes.rewardseen);

fs.writeFile("/etc/run/veryshare.pid", process.pid);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



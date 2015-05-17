var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var q = require('q');

var request = require('request');
var routes = require('./routes/');
var users = require('./routes/users');

var request = require('request');

var router = express.Router(); 

var cors = require('cors');

var LolApi = require('leagueapi');

var key = 'da1849f4-a901-412f-9e77-123d1731c909', server = 'euw';

LolApi.init(key, server);

var app = express();

var jsonParser = bodyParser.json();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

router.get('/', function(req, res) {
    res.json({ message: 'API' });   
});

var summonerName;
var summonerId = "";
var currentGame;
var champID = "";
var champsInfo;
var chop = [];

var getSummonerName = app.post('/api/getSummonerName', function (req, res){
	summonerName = req.body.summonerName;
	res.json({status: "success"});
	console.log("Post getSummonerName " + summonerName);
});

var setChampsID = app.post('/api/champIds', function (req, res){
  res.json(req.body);
  console.log(req.body);
  champID = req.body;
});

  var getChamps = app.get('/api/champInfo', function(req, res){
    for(champion in champID){
        request('https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/'+champID[champion]+'?locale=es_ES&champData=allytips,altimages,enemytips,image,info&api_key=da1849f4-a901-412f-9e77-123d1731c909', function(error, response, body){
           if(!error){
            chop[champion] = body;
          }
        })
      }
      console.log(chop);
      res.json(chop);
    });


var getSummonerData = app.get('/api/summonerData', function(req,res){
	LolApi.Summoner.getByName(summonerName, function(err, summoner) {
	    if(!err) {
			res.json(summoner);
			summonerId = JSON.stringify(summoner[summonerName].id);
			console.log("Get in SummonerData " + summonerId);
			if(err)
				res.send(err)
	    }
	})
});

var getMatchInfo = app.get('/api/matchInfo', function(req,res){
	var stringId = String(summonerId);
	console.log("MATCH INFO " + summonerId);
    LolApi.getCurrentGame(summonerId, 'euw', function(err, data){
    	if(!err){
		    res.json(data);
			summonerId = "";
    	}
		else{
			res.json({status: "failure"});
		}
    });
})

app.use('/', routes);
app.use('/api', router);
app.use('/api/summonerData', router);
app.use('/api/matchInfo', router);
app.use('/api/getSummonerName', router);
app.use('/api/getSummonerId', router);
app.use('/api/champInfo', router);
app.use('/api/champIds', router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

app.listen(3000);
    console.log("App listening on port 3000");


module.exports = app;

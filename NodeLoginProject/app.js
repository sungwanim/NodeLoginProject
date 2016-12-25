
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , usidb = require('mongojs').connect('loginproject', ['usrinfo']);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', (req,res) => {
	res.status(200).render('index.ejs');
});
app.get('/signup',(req,res) => {
	res.status(200).render('signup.ejs');
});
app.get('/login',(req,res) => {
	res.status(200).render('login.ejs');
});
app.put('/userinf', (req,res) => {
	var ema = req.param('ema');
	var nick = req.param('nick');
	var pwd = req.param('pwd');
	usidb.usrinfo.find({ema:ema},(error,data) => {
		if(data.length == 0) {
			res.send('success');
		} else {
			res.send('fail');
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

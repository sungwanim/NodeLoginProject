
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

// main page
app.get('/', (req,res) => {
	res.status(200).render('index.ejs');
});
// signup page
app.get('/signup',(req,res) => {
	res.status(200).render('signup.ejs');
});
// login page
app.get('/login',(req,res) => {
	res.status(200).render('login.ejs');
});
// signup PUT request
app.put('/signupusr', (req,res) => {
	var ema = req.param('ema');
	var nick = req.param('nick');
	var pwd = req.param('pwd');
	
	usidb.usrinfo.find((error,data) => {
		// success or fail
		var statue = {
			email : null,
			nickname : null,
			password : null
		}
		
		// email check
		for(var i in data) {
			if(data[i].ema == ema) {
				statue.email = 'fail';
			} else {
				statue.email = 'success';
			}
		}
		
		// nickname check
		for(var i in data) {
			if(data[i].nick == nick) {
				statue.nickname = 'fail';
			} else {
				statue.nickname = 'success';
			}
		}
		
		// password check
		for(var i in data) {
			if(data[i].pwd == pwd) {
				statue.password = 'fail';
			} else {
				statue.password = 'success';
			}
		}
		if(statue.email,statue.nickname,statue.password == 'success') {
			usidb.usrinfo.save({ ema : ema, nick : nick, pwd : pwd});
		}
		res.send(statue);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

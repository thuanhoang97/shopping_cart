var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var database = require('./lib/database');
var routes = require('./routes');


database.init(function(err){
	if(err){
		console.log(err);
		process.exit();
	}
	else{
		var app = express();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded());

		app.use(session({
		secret: 'js'
		}));
		app.use(function(req, res, next){	
		console.log('method: ',req.method, 'url: ', req.url);
		next();
		});
		app.set('views', path.join(__dirname, '/views'));
		app.set('view engine', 'ejs');

		app.use(express.static(path.join(__dirname, 'static/html')));
		app.use('/css', express.static(path.join(__dirname,'static/css')));
		app.use('/img', express.static(path.join(__dirname, 'static/img')));
		app.use('/js', express.static(path.join(__dirname, 'static/js')));
		app.use('/video', express.static(path.join(__dirname, 'static/video')));

		
		app.get('/login-register', routes.loginRegister);
		app.post('/login', routes.login.submit);
		app.post('/register', routes.register.submit);

		app.listen(1997, function(){
		console.log('Server is running on port 1997...');
		});
}
});



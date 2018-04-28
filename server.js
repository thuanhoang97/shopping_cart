var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var mysqldb = require('./mysql-database');

mysqldb.initDatabase(function(err, db){
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
		// console.log('session user: ', req.session.user);
		console.log('method: ',req.method, 'url: ', req.url);
		// console.log(mysqldb);
		next();
		});

		app.use(express.static(path.join(__dirname, 'static/html')));
		// app.use('/login-register', express.static(path.join(__dirname, 'static/html/register')))

		app.use('/css', express.static(path.join(__dirname,'static/css')));
		app.use('/img', express.static(path.join(__dirname, 'static/img')));
		app.use('/js', express.static(path.join(__dirname, 'static/js')));
		app.use('/video', express.static(path.join(__dirname, 'static/video')));
		// app.use('');

		// app.use('/login', express.static(path.join(__dirname, 'client/login')));
		// app.use('/register', express.static(path.join(__dirname, 'client/register')));
		// app.use('/css', express.static(path.join(__dirname, 'client/css')));
		// app.use('/js', express.static(path.join(__dirname, 'client/js')));
		// app.use('/img', express.static(path.join(__dirname, 'client/img')));
		// app.get('/register', function(res, rep){

		// });.
		app.get('/login-register', function(req, res){
			res.sendFile(path.join(__dirname, 'static/html/login-register.html'));
		});

		app.post('/login', function(req, res){
			var email = req.body.email;
			var password = req.body.password;
			console.log('login request:\n username:',email,' password:',password );

			if(email && password){
			var LOGIN= 'SELECT * FROM shoppingdb.user '  
				+'WHERE email="'+email+'" and password="'+password+'"';
			db.query(LOGIN, function(err, result){
				if(err){
					console.log(err);
					res.redirect('/login-register');	
				}
				else{
					if(result.length === 1) {
							//var resultsk = JSON.stringify(result);
							req.session.userId = result[0].id;
							req.session.email = result[0].email;
							console.log((result));
							console.log('Login sucessfully with ' + email);
							
					}
					else{		
							console.log('Can not login');	
						}
					}
					res.redirect('/');
				});
			}
		});

		app.post('/register', function(req, res){
			console.log(req.body);
			var username = req.body.username;
			var phone = req.body.phone;
			var email = req.body.email;
			var password = req.body.password;
			var comfirmPassword = req.body.comfirmPassword;
			

			var REGISTER = 'INSERT INTO shoppingdb.user(id, email, password)'
						+ ' VALUES(NULL, "' + email + '", "' + password + '")';

			db.query(REGISTER, function(err, result){
				if(err){
					console.log(err);
					res.redirect('/login-register');
				}
				else
				{
					var GET_ID_USER = '(SELECT id FROM shoppingdb.user WHERE email = "' + email+'")';
					var ADD_USER_INFO = 'INSERT INTO shoppingdb.userinfo(id, username, phone) VALUES'
						+ '('+GET_ID_USER+', "'+ username + '", "' + phone + '")'
					
					db.query(ADD_USER_INFO, function(err, result){
						if(err){
							console.log(err);
							res.redirect('/login-register');
						}
						else{
							res.redirect('/');
						}
					})
				}
			});
		});


		app.listen(1997, function(){
		console.log('Server is running on port 1997...');
		});
}
});



var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var mysqldb = require('./mysql-database').connectDatabase();

// mysqldb.connectDatabase(function(err, db){
// 	if(err){
// 		console.log(err);
// 		process.exit();
// 	}

	
// });


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

app.use(express.static(path.join(__dirname, 'client/home')));

app.use('/login', express.static(path.join(__dirname, 'client/login')));
app.use('/register', express.static(path.join(__dirname, 'client/register')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/img', express.static(path.join(__dirname, 'client/img')));


app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	console.log('login request:\n username:',username,' password:',password );
	if(username && password){
		var LOGIN= 'SELECT * FROM shoopingdb.usertb '  
			+'WHERE username="'+username+'" and password="'+password+'"';
		db.query(LOGIN, function(err, result){
			if(err){
				console.log(err);
			}
			else{
				if(result.length === 1) {
						//var resultsk = JSON.stringify(result);
						req.session.userId = result[0].id;
						req.session.username = result[0].username;
						console.log((result));
						console.log('Login sucessfullt with ' + username);
						res.redirect('/');
				}
				else{		
						console.log('Can not login');
						res.redirect('/');		
					}
				}
			});
		}
	});

app.post('/register', function(req, res){
	console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;
	var comfirmPassword = req.body.comfirmPassword;
	var phone = req.body.phone;
	var name = req.body.name;



	var REGISTER = 'INSERT INTO TABLE shoppingdb.user(id, email, password)'
				+ 'VALUES(NULL,' + email + ',' + password + ')';

	mysqldb.query(REGISTER, function(err, result){
		if(err){
			console.log(err);
		}
		else{
			var GET_ID_USER = 'SELECT id FROM shoppingdb.user WHERE email = ' + email;
			mysqldb.query(GET_ID_USER, function(err, result){
				if(err){
					console.log(err);
				}
				else{
					console.log(result);
				}
			})

			// var ADD_USER_INFO = 'INSERT INTO TABLE shoppingdb.userinfo(id, username, email, phone) VALUES('
			// 	+'(SELECT id from shoppingdb.user WHERE id = ' + 
		}
	});

});


app.listen(1997, function(){
	console.log('Server is running on port 1997...');
});
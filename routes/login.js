// var database = require('../lib/database');
var User = require('../lib/user');


exports.submit = function(req, res){
	console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;
	var warnning = "";

	User.getByEmail(email, function(user){
		if(user.id){
			console.log(user);
			if(user.email === email && user.password === password){
				return res.redirect('/');
			}
			else{
				warnning = 'password is not correct';
			}
		}
		else
			warnning = 'Email is not exists';
		req.session.warnText = {type:'login', msg:warnning}
		res.redirect('/login-register');
		
	});

};


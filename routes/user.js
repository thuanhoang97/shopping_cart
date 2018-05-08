var User = require('../lib/user');
var UserInfo = require('../lib/user_info');

exports.login = function(req, res){
	//console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;

	User.login(email, password, function(err, user){
		if(err){
			req.session.warnText = {type: 'login', msg: err};
			res.redirect('/login-register');
		}else{
			req.session.user = user;
			console.log(user);
			res.redirect('/');
		}
	});

};

exports.logout = function(req, res){
	req.session.user = null;
	res.redirect('/');
};

exports.register = function(req, res){
	// console.log(req.body);
	var newUser = req.body;

	User.register(newUser, function(err){
		if(err){
			req.session.warnText = {type:'register', msg: err};
			res.redirect('/login-register');
		}else{
			User.save(newUser.email, newUser.password, function(user){
				var userInfo = new UserInfo(newUser.phone, newUser.username);
				console.log(userInfo);
				user.saveInfo(userInfo);
				req.session.user = {id: user.id, email: newUser.email};
				res.redirect('/');
			});
		}
	});
};

exports.addToCart= function(req, res){
	var user = new User(req.session.user.id);
	var productName = req.params.name;
	if(user){
		var today = new Date().toISOString().slice(0, 10);
		user.buy(productName, today, function(err){
			if(err)
				console.log(err);
			else
				res.redirect('/');
		});
	}else
		res.redirect('/login-register');
}

exports.showCart = function(req, res){
	var user = new User(req.session.user.id);
	user.getListProducts(function(err, products){
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			console.log(products);
			res.render('cart',{
				session:req.session,
				products:products
			});
		}
	});
};
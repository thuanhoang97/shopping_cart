var User = require('../lib/user');
var UserInfo = require('../lib/user_info');


var getCurrentDate = function(){
	var date = new Date();
	return date.getFullYear() + '-'
		+  (date.getMonth()+1) + '-'
		+  date.getDate() + ' '
		+  date.getHours() + ':'
		+  date.getMinutes() + ':'
		+  date.getSeconds();
};

exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	User.login(email, password, function(err, user){
		if(err){
			req.session.warning = {type: 'login', msg: err};
			res.redirect('/login-register');
		}else{
			req.session.user = user;
			console.log(user);
			res.redirect('/');
		}
	});

};

exports.logout = function(req, res){
	delete req.session.user;
	res.redirect('/');
};

exports.register = function(req, res){
	// console.log(req.body);
	var newUser = req.body;

	User.register(newUser, function(err){
		if(err){
			req.session.warning = {type:'register', msg: err};
			res.redirect('/login-register');
		}else{
			User.save(newUser.email, newUser.password, function(user){
				// var userInfo = new UserInfo(newUser.phone, newUser.username);
				// console.log(userInfo);
				user.saveInfo(newUser);
				req.session.user = {id: user.id, email: newUser.email};
				res.redirect('/');
			});
		}
	});
};

exports.addToCart= function(req, res){
	if(req.session.user){
		var user  = new User(req.session.user.id);
		var productId = req.params.id;
		var today = getCurrentDate();
		user.buy(productId, today, function(err){
			if(err)
				console.log(err);
			else
				res.redirect('/'+ user.id + '/cart');
		});
	}else{
		res.redirect('/login-register');
	}

}

exports.delFromCart = function(req,res){
	console.log(req.params.date);
	var date = req.params.date;
	var user = new User(req.session.user.id);
	user.unBuy(date, function(err){
		if(err){
			console.log(err);
			res.redirect('/');
		}else
			res.redirect('/'+user.id+'/cart');

	})
};

exports.showCart = function(req, res){
	var user = new User(req.session.user.id);
	user.getListProducts(function(err, products){
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			// console.log(products);
			res.render('cart',{
				session:req.session,
				products:products,
			});
		}
	});
};
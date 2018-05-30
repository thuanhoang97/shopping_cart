var User = require('../model/User');
var Order = require('../model/Order');
var UserInfo = require('../model/UserInfo');


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

	User.getByEmail(email, function(user){
		if(user == null){
			req.session.warning = {type: 'login', msg: 'Email is not exists!'};
			res.redirect('/login-register');
		}else{
			req.session.user = {id: user.id, email: user.email};
			res.redirect('/');
		}
	});

};

exports.logout = function(req, res){
	delete req.session.user;
	res.redirect('/');
};

exports.register = function(req, res){
	var newUser = req.body;
	console.log(newUser);

	User.checkNewUser(newUser, function(err){
		if(err){
			req.session.warning = {type: 'register', msg: err};
			res.redirect('/login-register');
		}else{
			User.createNewUser(newUser, function(userId){
				req.session.user = {id: userId, email: newUser.email};
				res.redirect('/');
			});
		}
	});
};


exports.addToCart= function(req, res){
	if(req.session.user){
		var orderInfo = req.body;
		orderInfo.price = Number(orderInfo.price.replace(/\,/g,''));
		console.log(orderInfo);
		var user  = new User(req.session.user.id);
		var order = new Order(user.id, orderInfo.productId,orderInfo.number, orderInfo.price);
		Order.createId(function(id){
			order.setId(id);
			console.log(order);
			user.buy(order, function(err){
				if(err){
					console.log(err);
					res.redirect('/');
				}else{
					res.redirect('/' + user.id + '/cart');
				}
				
			});
		});
	}else{
		res.redirect('/login-register');
	}

}

exports.delFromCart = function(req,res){
	var orderId = req.params.orderId;
	var user = new User(req.session.user.id);
	user.unBuy(orderId, function(err){
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
		if(!err)
			res.render('cart',{products: products});
	});
};
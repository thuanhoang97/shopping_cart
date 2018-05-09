var path = require('path');
var Product= require('../lib/Product');


// exports.login = require('./login');
// exports.register = require('./register');
exports.admin = require('./admin');
exports.user = require('./user');


exports.getSession = function(req, res, next){
	res.locals.user = req.session.user || null;
	next();
};

exports.loginRegisterForm = function(req, res){
	res.locals.warning = req.session.warning || "";
	console.log(res.locals.warning);
	res.render('login-register');
	delete req.session.warnning;
};

exports.home = function(req, res){
	res.render('index');
};

exports.productForm = function(req, res){
	var productName = req.params.name;
	Product.getIdByName(productName, function(id){
		if(id){
			var product = new Product(id);
			product.retrieveInfo(function(err){
				if(!err){
					product.retrieveSpecs(function(err){
						product.price = product.price.toLocaleString();
						res.render('product',{
							product: product
						});
					});
				}
			});
		}else{
			res.redirect('/');
		}

	});
};
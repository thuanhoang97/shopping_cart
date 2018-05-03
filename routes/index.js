var path = require('path');
var Product= require('../lib/Product');

exports.login = require('./login');
exports.register = require('./register');
exports.admin = require('./admin');


exports.loginRegister = function(req, res){
	res.render('login-register', {session:req.session});
	req.session.warnText = null;
};

exports.home = function(req, res){
	res.render('index', {session:req.session});
};

exports.logout = function(req, res){
	req.session.user = null;
	res.redirect('/');
};

exports.productForm = function(req, res){
	var productName = req.params.name;
	console.log(productName);
	Product.getProductSpecsByName(productName, function(err, productSpecs){
		if(err){
			console.log(err);
		}
		else{
			console.log()
			res.render('product', {
				session: req.session,
				product: productSpecs,
				name: productName
			});
		}
	});
};
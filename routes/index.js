var path = require('path');
var Product= require('../lib/Product');


// exports.login = require('./login');
// exports.register = require('./register');
exports.admin = require('./admin');
exports.user = require('./user');


exports.loginRegisterForm = function(req, res){
	res.render('login-register', {session:req.session});
	req.session.warnText = null;
};

exports.home = function(req, res){
	res.render('index', {session:req.session});
};

exports.productForm = function(req, res){
	var productName = req.params.name;
	Product.getProductSpecsByName(productName, function(productSpecs){
		Product.getByName(productName, function(product){
			console.log(productSpecs);
			res.render('product', {
				session: req.session,
				productSpecs: productSpecs,
				product: product
			});
		});
	});
};
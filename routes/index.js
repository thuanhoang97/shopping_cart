var path = require('path');
var Product= require('../model/Product');


exports.admin = require('./admin');
exports.user = require('./user');


exports.getSession = function(req, res, next){
	res.locals.user = req.session.user;
	res.locals.adminLogin = req.session.adminLogin;
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
	var type = req.params.type;
	console.log(type + " " + productName);
	Product.getIdByName(productName, function(id){
		if(id){
			var product = new Product(id);
			product.getData(function(err){
				if(!err){
					product.getSpecs(type,function(err){
						if(!err){
							product.price = product.price.toLocaleString();
							res.render('product',{
								type: type,
								product: product
							});
						}
					});
				}
			});
		}else{
			res.redirect('/');
		}

	});
};

exports.viewProduct = function(req, res){
	var type = req.params.type;
	console.log(type);
	Product.getProductByType(type, function(err, products){
		if(err){
			console.log();
			res.redirect('/');
		}else{
			for(var i=0; i<products.length;i++){
				console.log(products[i]);
			}
			res.render('view_products', {type: type, products: products});
		}
	});

}
var path = require('path')
var Product = require('../lib/product');


exports.form = function(req, res){
	var adminLogin  = req.session.adminLogin;
	res.render('admin', {adminLogin: adminLogin});
};

exports.login = function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(username==="admin" && password==="123321"){
		req.session.adminLogin = true;
	}
	res.redirect('/admin');
}

exports.logout = function(req, res){
	req.session.adminLogin = false;
	res.redirect('/admin');
};

exports.addProductForm = function(req, res){
	res.render('product_specs');
};

exports.addProduct = function(req, res){
	console.log(req.body);
	var newProduct = req.body;

	Product.save(newProduct, function(err){
		if(err){
			console.log(err);
			res.redirect('/admin/add-product');
		}else{
			res.redirect('/admin');
		}
	});
};

var path = require('path')
var Product = require('../model/Product');
var Order = require('../model/Order');


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
	var type = req.params.type ;
	console.log(type);
	res.render('addproduct', {type: type});
};

exports.addProduct = function(req, res){
	var type = req.params.type;
	var newProduct = req.body;
	newProduct.price = Number(newProduct.price.replace(/\./g,''));
	// console.log(newProduct);
	Product.save(newProduct, type, function(err){
		if(err){
			res.redirect('/admin/'+ type +'/add');
		}else{
			res.redirect('/admin');
		}
	});
	
};

exports.viewOrders = function(req, res){
	Order.getAll(function(err, orders){
		if(!err)
			res.render('view_orders', {orders: orders});
	});
}

exports.processOrder = function(req, res){
	var orderId = req.body.orderId;
	Order.processed(orderId, function(err){
		if(err)
			console.log(err);
		res.redirect('/admin/view-orders');
	})
	
}

exports.viewWarehouse = function(req, res){
	res.render('warehouse');
}

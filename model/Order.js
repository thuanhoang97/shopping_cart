var database = require('../database');

var getCurrentDate = function(){
	var date = new Date();
	return date.getFullYear() + '-'
		+  (date.getMonth()+1) + '-'
		+  date.getDate() + ' '
		+  date.getHours() + ':'
		+  date.getMinutes() + ':'
		+  date.getSeconds();
};

function Order(userId, productId, number, price){
	this.id = "";
	this.userId = userId;
	this.productId = productId;
	this.number = number;
	this.price = price;
	this.date = this.getCurrentDate();
	this.state = false;
}


Order.prototype.getCurrentDate = function(){
	var date = new Date();
	return date.getFullYear() + '-'
		+  (date.getMonth()+1) + '-'
		+  date.getDate() + ' '
		+  date.getHours() + ':'
		+  date.getMinutes() + ':'
		+  date.getSeconds();
}

Order.prototype.getTotalPrice = function(){
	return this.number*this.price;
}

Order.prototype.getId = function(){
	return this.id;
}

Order.prototype.setId = function(id){
	this.id = id;
}

Order.createId = function(cb){
    var id = Order.randomId();  
    var SELECT_ID = 'SELECT id FROM shoppingdb.orders WHERE id = "' + id + '"' ;
    database.query(SELECT_ID,function(err){
    	if(err){
    		console.log(err);
    		Order.createId(cb);
    	}
    	else
    		cb(id);
    });
}

Order.randomId = function(){
	return Math.random().toString(36).substr(2, 10);
}

Order.getAll = function(cb){
	var SELECT_ORDERS = 'SELECT o.id, u.username, p.name as productName, o.number, o.date, o.state, o.price FROM ' 
		+ 'shoppingdb.orders o INNER JOIN shoppingdb.product p '
		+ 'ON o.productId = p.id '
		+ 'INNER JOIN shoppingdb.userInfo u '
		+ 'ON o.userId =  u.id ';
	database.query(SELECT_ORDERS, cb);
}

Order.processed = function(id,cb){
	var CHANGE_STATE = 'UPDATE shoppingdb.orders SET state = true WHERE id = "' + id + '"';
	database.query(CHANGE_STATE,cb);
}

module.exports = Order;
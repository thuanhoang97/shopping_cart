module.exports = User;

var database = require('../database');
var UserInfo = require('./userInfo');

function User(id){
	this.id = id;
}


User.prototype.saveInfo = function(username, phone){
	var userInfo = new UserInfo(username, phone);
	userinfo.save(this.id);
}

User.prototype.changePassword = function(password){
	var UPDATE_PASSWORD = 'ALTER TABLE shoppingdb.user'
				+ 'SET password = ' + password +
				+ 'WHERE id = ' + this.id;
	database.query(UPDATE_PASSWORD, function(err,result){
		if(err)
			console.log(err);
	});
};


User.prototype.buy = function(order, cb){
	var INSERT_SALE = 'INSERT INTO shoppingdb.orders(id,userId, productId,'
	 	+'state, date, number, price) VALUES'
		+ '("' + order.id + '", "' + order.userId + '", "' + order.productId + '", ' 
		+ order.state + ', "'+ order.date +'",' +order.number+ ', ' +order.getTotalPrice() +')';
	database.query(INSERT_SALE, cb);
};

User.prototype.unBuy = function(orderId, cb){
	var DELETE_SALE = 'DELETE FROM shoppingdb.orders ' 
		+' WHERE userId =' + this.id + ' AND id = "' + orderId + '"';
	database.query(DELETE_SALE, cb);
};

User.prototype.getListProducts = function(cb){
	var SELECT_PRODUCTS = 'SELECT o.id, p.name, p.price,p.imgPath,'
	    + 'o.number, o.price as total,DATE_FORMAT(o.date, "%Y-%m-%d %H:%i:%s") as date FROM '
		+ 'shoppingdb.product p INNER JOIN shoppingdb.orders o '
		+ 'ON p.id = o.productId '
		+ 'WHERE o.userId = ' + this.id;
	database.query(SELECT_PRODUCTS,cb);
};


User.checkNewUser = function(newUser, cb){
	if(newUser.password < 6)
		return cb("Password must has at least 6 characters!");
	if(newUser.password !== newUser.confirmPassword)
		return cb("Those passwords didn't match. Try again!");
	if(newUser.phone.length<10)
		return cb("Phone number is incorrect!");

	User.getIdByEmail(newUser.email, function(id){
		if(id)
			cb("This email is taken. Try another!");
		else
			cb();
	});

};

User.createNewUser = function(newUser,cb){
	var INSERT_USER = 'INSERT INTO shoppingdb.user(id, email, password) '
		+ 'VALUES(NULL,"' + newUser.email + '", "' + newUser.password + '")';
	database.query(INSERT_USER, function(err, result){
		if(err){
			return console.log(err);
		}else{
			User.getIdByEmail(newUser.email, function(id){
				var userInfo = new UserInfo(newUser.username, newUser.phone);
				userInfo.save(id);
				cb(id);
			})
		}
	}); 
}


User.getIdByEmail = function(email, cb){
	var FIND_ID = 'SELECT id  FROM shoppingdb.user '
		+ 'WHERE email="' + email + '"';
	database.query(FIND_ID, function(err, result){
		if(err)
			return console.log(err);
		if(result.length == 1)
			return cb(result[0].id);
		cb();
	});
};



User.getByEmail = function(email, cb){
	var FIND_USER = 'SELECT * FROM shoppingdb.user '
			+ 'WHERE email="' + email + '"';

	database.query(FIND_USER, function(err, result){
		if(err){
			return console.log(err);
		}
		if (result.length == 1){
			return cb({id:result[0].id, email:result[0].email, password: result[0].password});
		}

		cb(null);
	});
};










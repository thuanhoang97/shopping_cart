var database = require('./database');

function User(id){
	this.id = id;
}

User.prototype.saveInfo = function(userInfo){
	var INSERT_USER_INFO = 'INSERT INTO shoppingdb.userinfo(id, username, phone)'
		+ 'VALUES(' + this.id + ',"' + userInfo.username + '","' + userInfo.phone + '")';
	database.query(INSERT_USER_INFO, function(err, result){
		if(err){
			console.log(err);
		}
		// else{
		// 	console.log('Save user info successfully!');
		// }
	});
};

User.prototype.buy = function(productId, date, cb){
	var INSERT_SALE = 'INSERT INTO shoppingdb.sale(userId, productId, date) VALUES'
		+ '(' + this.id + ', "' + productId + '", "' +date + '")';
	database.query(INSERT_SALE, cb);
};

User.prototype.unBuy = function(date, cb){
	var DELETE_SALE = 'DELETE FROM shoppingdb.sale ' 
		+' WHERE userId =' + this.id + ' AND date = CAST("' + date+'" as datetime)';
	database.query(DELETE_SALE, cb);
};

User.prototype.getListProducts = function(cb){
	var SELECT_PRODUCTS = 'SELECT p.id, p.name, p.price,p.imgPath, DATE_FORMAT(s.date, "%Y-%m-%d %H:%i:%s") as date FROM '
		+ 'shoppingdb.product p INNER JOIN shoppingdb.sale s '
		+ 'ON p.id = s.productId '
		+ 'WHERE s.userId = ' + this.id;
	database.query(SELECT_PRODUCTS, cb);
};

User.prototype.changePassword = function(password){
	var UPDATE_PASSWORD = 'ALTER TABLE shoppingdb.user'
				+ 'SET password = ' + password +
				+ 'WHERE id = ' + this.id;
	database.query(UPDATE_PASSWORD, function(err,result){
		if(err)
			console.log(err);
	});
};

User.save = function(email, password, cb){
	var INSERT_USER = 'INSERT INTO shoppingdb.user(id, email, password) '
		+ 'VALUES(NULL,"' + email + '", "' + password + '")';
	database.query(INSERT_USER, function(err, result){
		if(err){
			return console.log(err);
		}else{
			User.getIdByEmail(email, function(id){
				cb(new User(id));
			})
		}
	}); 
};


User.login = function(email, password, cb){
	var FIND_USER = 'SELECT * FROM shoppingdb.user '
			+ 'WHERE email="' + email + '"';

	database.query(FIND_USER, function(err, result){
		if(err){
			return console.log(err);
		}else if(result.length==1){
			if(result[0].email == email && result[0].password == password){
				cb("", {id:result[0].id, email:result[0].email});
			}else{
				cb("Password is incorrect!");
			}
		}else
			cb("Email is not exists!");
	});
};

User.register = function(newUser, cb){
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

User.getByEmail = function(email, cb){
	var FIND_USER = 'SELECT * FROM shoppingdb.user '
			+ 'WHERE email="' + email + '"';

	database.query(FIND_USER, function(err, result){
		if(err){
			return console.log(err);
		}
		if (result.length == 1){
			return cb(new User(result[0].id, result[0].email), result[0].password);
		}

		cb();
	});
};

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

module.exports = User;

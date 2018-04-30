var database = require('./database');

function User(userObj){
	for(var key in userObj){
		this[key] = userObj[key];
	}
}


User.getByEmail = function(email, cb){
	var FIND_EMAIL = 'SELECT * FROM shoppingdb.user '
			+ 'WHERE email="' + email + '"';

	database.query(FIND_EMAIL, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		if(result.length==1)
			return cb(new User(result[0]));
		return cb({});
	});
};

User.getIdByEmail = function(email, cb){
	var FIND_ID = 'SELECT id  FROM shoppingdb.user '
		+ 'WHERE email="' + email + '"';
	database.query(FIND_ID, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		if(result.length==1)
			return cb(result[0]);
		return cb(0);
	});
};

User.prototype.save = function(){
	var INSERT_USER = 'INSERT INTO shoppingdb.user(id, email, password) '
		+ 'VALUES(NULL,"' + this.email + '", "' + this.password + '")';
	database.query(INSERT_USER, function(err, result){
		if(err){
			console.log(err);
		}else{
			console.log('Save user successfully!');	
		}
	}); 
};

User.prototype.saveInfo = function(){
	var SELECT_ID = '(SELECT id FROM shoppingdb.user WHERE email = "' + this.email+'")'
	var INSERT_USER_INFO = 'INSERT INTO shoppingdb.userinfo(id, username, phone)'
		+ 'VALUES(' + SELECT_ID + ',"' + this.username + '","' + this.phone + '")';
	database.query(INSERT_USER_INFO, function(err, result){
		if(err){
			console.log(err);
		}
		else{
			console.log('Save user info successfully!');
		}
	});
};

module.exports = User;

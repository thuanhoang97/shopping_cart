var  mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123321'
});


exports.query = function(STRING_QUERY, cb){
	connection.query(STRING_QUERY, cb);
};

exports.init = function(cb){
	var createUserInfoTable = function(){
		var CREATE_USER_INFO_TABLE = 'CREATE TABLE IF NOT EXISTS shoppingdb.userinfo('
						+'id INT NOT NULL PRIMARY KEY,'
						+'username  VARCHAR(60) NOT NULL,'
						+'phone INT(11) NOT NULL,'
						+'CONSTRAINT fk_id FOREIGN KEY(id)  REFERENCES shoppingdb.user(id))';

		connection.query(CREATE_USER_INFO_TABLE, function(err, result){
			if(err){
				console.log('Can not create user info table');
				cb(err);
			}
		});
	};

	var createUserTable = function(){
		var CREATE_USER_TABLE = 'CREATE TABLE IF NOT EXISTS shoppingdb.user('
						+'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,'
						+'email VARCHAR(60) NOT NULL UNIQUE,'
						+'password VARCHAR(20) NOT NULL)';

		connection.query(CREATE_USER_TABLE, function(err, result){
			if(err){
				console.log('Can not create user table');
				cb(err);
			}else{
				createUserInfoTable();
			}
		});
	};

	var createDatabase = function(){
		var CREATE_DATABASE = 'CREATE DATABASE IF NOT EXISTS shoppingdb';
		connection.query(CREATE_DATABASE, function(err, result){
			if(err){
				console.log('Can not create database shoppingdb');
				cb(err);
			}else{
				createUserTable();
			}
		});
	};

	

	connection.connect(function(err){
		console.log('Connecting to database...');
		if(err) {
			console.log('Connect database has an error! Exit!');
			cb(err);
		}
		else{
			console.log('Connect sucessfuly!');
			createDatabase();
			cb();
		}
	});
};

// exports.getUser = function(user, cb){
// 	var FIND_USER= 'SELECT * FROM shoppingdb.user '  
// 				+'WHERE email="'+user.email+'" and password="'+user.password+'"';
// 	findRecord(FIND_USER, function(err, result){
// 		if(err)
// 			return cb(err);
// 		if(result.length==1)
// 			return cb(null, result[0])
// 		return cb(null,{})
			
// 	});
// };

// exports.getEmail = function(email, cb){
// 	var FIND_USER_BY_EMAIL = 'SELECT email FROM shoppingdb.user '
// 			+ 'WHERE email="' + email + '"';
// 	findRecord(FIND_USER_BY_EMAIL, function(err,result){
// 		if(err)
// 			return cb(err);
// 		if(result.length==0)
// 			return cb(null, result[0]);
// 		return cb(null, "");
// 	})
// };

// exports.insertUser= function(user, cb){
// 	var insertUserInfo = function(){
// 		var GET_ID_USER = '(SELECT id FROM shoppingdb.user WHERE email = "' + user.email+'")';
// 		var INSERT_USER_INFO = 'INSERT INTO shoppingdb.userinfo(id, username, phone) VALUES('
// 					+GET_ID_USER+', "'+ user.username + '", "' + user.phone + '")';
// 		connection.query(INSERT_USER_INFO, function(err, result){
// 			if(err)
// 				return cb(err);
// 		});
// 	}

// 	var INSERT_USER = 'INSERT INTO shoppingdb.user(id, email, password)'
// 					+ ' VALUES(NULL, "' + user.email + '", "' + user.password + '")';
// 	connection.query(INSERT_USER, function(err, result){
// 		if(err)
// 			return cb(err);
// 		insertUserInfo();
// 		cb();
// 	});

// };

// exports.alterUserInfo = function(){

// };


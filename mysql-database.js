var  mysql = require('mysql');

exports.initDatabase = function(cb){
	console.log('Connecting to database...');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '123321'
	});

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
		if(err) {
			console.log('Connect database has an error! Exit!');
			cb(err);
		}
		else{
			console.log('Connect sucessfuly!');
			createDatabase();
			cb(err, connection);
		}
	});
};
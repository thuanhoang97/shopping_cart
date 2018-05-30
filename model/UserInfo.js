var database = require('../database');

module.exports = UserInfo;


function UserInfo(username, phone){
	this.username = username;
	this.phone = phone;
}

UserInfo.prototype.save = function(userId){
	var INSERT_USER_INFO = 'INSERT INTO shoppingdb.userInfo(id, username, phone)'
		+ 'VALUES(' + userId + ',"' + this.username + '","' + this.phone + '")';
	database.query(INSERT_USER_INFO, function(err, result){
		if(err){
			console.log(err);
		}
	});
}
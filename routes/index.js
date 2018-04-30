var path = require('path');

exports.login = require('./login');
exports.register = require('./register');

exports.loginRegister = function(req, res){
	console.log('warn session: ' + req.session.warnText);
	var warnText = req.session.warnText || null;
	req.session.warnText = null;
	res.render('login-register', {
		warnText : warnText
	});
};
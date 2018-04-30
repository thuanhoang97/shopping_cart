var User = require('../lib/user');


exports.submit = function(req, res){
	console.log(req.body);
	var register = req.body;
	var warnning = "";

	if(register.password !== register.confirmPassword){
		warnning = "Those passwords didn't match. Try again.";
	}
	else{
		User.getIdByEmail(register.email, function(id){
			if(id){
				warnning = "This email is taken. Try another.";
			}
			else{
				var user = new User(register);
				user.save();
				user.saveInfo();
				return res.redirect('/');
			}
		})
	}
	req.session.warnText = {type:'register', msg:warnning};
	res.redirect('/login-register');
	
};
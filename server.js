var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var database = require('./lib/database');
var routes = require('./routes');


database.init(function(err){
	if(err){
		console.log(err);
		process.exit();
	}
	else{
		var app = express();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded());

		app.use(session({
		secret: 'js'
		}));
		app.use(routes.getSession);
		app.use(function(req, res, next){	
		console.log('method: ',req.method, 'url: ', req.url);
		// console.log('Session:', req.session);

			next();
		});
		app.set('views', path.join(__dirname, '/views'));
		app.set('view engine', 'ejs');

		// app.use(express.static(path.join(__dirname, 'views')));
		app.use('/css', express.static(path.join(__dirname,'static/css')));
		app.use('/img', express.static(path.join(__dirname, 'static/img')));
		app.use('/js', express.static(path.join(__dirname, 'static/js')));
		app.use('/video', express.static(path.join(__dirname, 'static/video')));

		app.get('/', routes.home);

		app.get('/admin', routes.admin.form);
		app.post('/admin/login', routes.admin.login);
		app.get('/admin/logout', routes.admin.logout);
		app.get('/admin/add-product', routes.admin.addProductForm);
		app.post('/admin/add-product', routes.admin.addProduct);

		app.get('/login-register', routes.loginRegisterForm);
		app.get('/:id/cart', routes.user.showCart);
		app.post('/login', routes.user.login);
		app.post('/register', routes.user.register);
		app.post('/logout', routes.user.logout);
		app.post('/add-to-cart/:id', routes.user.addToCart);
		app.post('/del-from-cart/:date', routes.user.delFromCart);

		app.get('/product/:name', routes.productForm);

		app.listen(1997, function(){
		console.log('Server is running on port 1997...');
		});
}
});



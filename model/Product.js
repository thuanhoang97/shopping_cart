var database = require('../database');
var IPhoneSpecs = require('./IPhoneSpecs');
var IPadSpecs = require('./IPadSpecs');
var MacSpecs = require('./MacSpecs');
var WatchSpecs = require('./WatchSpecs');


// function ProductSpecs(specs){
// 	this.screen = specs.screen;
// 	this.os = specs.os;
// 	this.backCamera = specs.backCamera;
// 	this.frontCamera = specs.frontCamera;
// 	this.cpu = specs.cpu;
// 	this.ram = specs.ram;
// 	this.memory = specs.memory;
// 	this.sim = specs.sim;
// 	this.battery = specs.battery;
// }

function Product(id, name, price, imgPath){
	this.id = id;
	this.name = name;
	this.price = price;
	this.imgPath = imgPath;
	this.specs = null;
}

Product.prototype.getData = function(cb){
	var SELECT_INFO = 'SELECT name, price, imgPath ' 
		+ 'FROM shoppingdb.product WHERE id = "' + this.id + '"';
	database.query(SELECT_INFO, function(err, result){
		if(err){
			console.log(err);
			cb(err);
		}
		if(result.length==1){
			this.name = result[0].name;
			this.price = result[0].price;
			this.imgPath = result[0].imgPath;
		}
		cb();

	}.bind(this));
};

Product.prototype.getSpecs = function(type,cb){
	if(type === 'iphone'){
		this.specs = new IPhoneSpecs(); 
	}else if(type === 'ipad'){
		this.specs = new IPadSpecs();
	}else if(type === 'mac'){
		this.specs = new MacSpecs();
	}else if(type === 'watch'){
		this.specs = new WatchSpecs();
	}
	this.specs.getData(this.id, cb);
}

// Product.prototype.retrieveSpecs = function(cb){
// 	var SELECT_SPECS = 'SELECT * FROM shoppingdb.product_specs WHERE productId =' + this.id;
// 	database.query(SELECT_SPECS, function(err,result){
// 		if(err)
// 			return console.log(err);

// 		if(result.length == 1){
// 			this.specs = new ProductSpecs(result[0]);
// 			cb();
// 		}else
// 			cb(true);
// 	}.bind(this));	
// };



Product.save = function(newProduct, type, cb){
	var INSERT_PRODUCT = 'INSERT INTO shoppingdb.product(id,name, price, imgPath, type) VALUES(' 
				+ 'NULL,"' + newProduct.name + '", "'
				+ newProduct.price + '", "'
				+ newProduct.imgPath + '", "'
				+ type + '")';
	database.query(INSERT_PRODUCT, function(err){
		if(err){
			console.log(err);
			cb(err);
		}
		else{
			Product.getIdByName(newProduct.name, function(id){
				if(id){
					var specs ;
					if(type === "iphone"){
						specs = new IPhoneSpecs();
					}else if(type === "ipad"){
						specs = new IPadSpecs();
					}else if(type === "mac"){
						specs = new MacSpecs();
					}else if(type === "watch"){
						newProduct.glass = (newProduct.glass === 'on');
						newProduct.waterproof = (newProduct.waterproof === 'on');
						specs = new WatchSpecs();
					}
					specs.init(newProduct);
					specs.save(id, function(err){
						if(err){
							console.log(err);
							cb(err);
						}else{
							cb();
						}
					});
					
				}
			})
		}
	});
};


Product.getIdByName = function(name, cb){
	var SELECT_ID = 'SELECT id FROM shoppingdb.product WHERE name="' + name +'"';
	database.query(SELECT_ID, function(err,result){
		if(err){
			console.log(err);
		}
		else if(result.length===1){
			cb(result[0].id);
		}else
			cb();
	})
};

Product.getProductByType = function(type, cb){
	var SELECT_PRODUCT = 'SELECT * FROM shoppingdb.product WHERE type = "' + type + '"';
	database.query(SELECT_PRODUCT, cb);
}

// Product.getProductSpecsByName = function(name, cb){
// 	var SELECT_PRODUCT_SPECS = 'SELECT * FROM shoppingdb.product_specs WHERE name ="' + name+ '"';
// 	database.query(SELECT_PRODUCT_SPECS, function(err,result){
// 		if(err){
// 			console.log(err);
// 		}else if(result.length===1){
// 		cb(new ProductSpecs(result[0]));
// 	}else
// 		cb();
// 	});	
// };

// Product.getById = function(name, cb){
// 	var SELECT_PRICE = 'SELECT * FROM shoppingdb.product WHERE name = "' + name + '"';
// 	database.query(SELECT_PRICE, function(err, result){
// 		if(err)
// 			console.log(err);
// 		else if(result.length==1)
// 			cb(new Product(result[0]));
// 		else
// 			cb();

// 	});
// };

module.exports = Product;
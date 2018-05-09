var database = require('./database');



function ProductSpecs(specs){
	this.screen = specs.screen;
	this.os = specs.os;
	this.backCamera = specs.backCamera;
	this.frontCamera = specs.frontCamera;
	this.cpu = specs.cpu;
	this.ram = specs.ram;
	this.memory = specs.memory;
	this.sim = specs.sim;
	this.battery = specs.battery;
}

function Product(id){
	// this.name = info.name;
	// this.price = info.price;
	// this.imgPath = info.imgPath;
	this.id = id;
}

Product.prototype.retrieveInfo = function(cb){
	var SELECT_INFO = 'SELECT name, price, imgPath ' 
		+ 'FROM shoppingdb.product WHERE id = "' + this.id + '"';
	database.query(SELECT_INFO, function(err, result){
		if(err)
			return console.log(err);
		if(result.length==1){
			this.name = result[0].name;
			this.price = result[0].price;
			this.imgPath = result[0].imgPath;
			cb();
		}
		else
			cb(true);

	}.bind(this));
};

Product.prototype.retrieveSpecs = function(cb){
	var SELECT_SPECS = 'SELECT * FROM shoppingdb.product_specs WHERE productId =' + this.id;
	database.query(SELECT_SPECS, function(err,result){
		if(err)
			return console.log(err);

		if(result.length == 1){
			this.specs = new ProductSpecs(result[0]);
			cb();
		}else
			cb(true);
	}.bind(this));	
};

// Product.prototype.save = function(cb){
// 	var INSERT_PRODUCT = 'INSERT INTO shoppingdb.product(id, name) ' 
// 				+ 'VALUES(NULL, "' + this.name + '")';
// 	database.query(INSERT_PRODUCT, function(err, result){
// 		if(err){
// 			return cb(err);
// 		}
// 		else{
// 			var SELECT_ID = '(SELECT id FROM shoppingdb.product WHERE name="'+this.name+'")';
// 			var INSERT_PRODUCT_SPECS = 'INSERT INTO shoppingdb.product_specs'
// 				+ '(id, slogan, screen, os, back_camera, front_camera,' 
// 				+ 'cpu, ram, memory, sim, battery, price, img_path) '
// 				+ 'VALUES('+ SELECT_ID +', "' + this.slogan + '", "' + this.screen + '",'
// 				+ '"' + this.os + '", "' + this.backCamera + '", "' + this.frontCamera + '",'
// 				+ '"' + this.cpu + '", "' + this.ram + '", "' + this.memory + '",'
// 				+ '"' + this.sim + '", "' + this.battery + '", "' + this.price + '",' 
// 				+ '"' + this.imgPath + '")';
// 			database.query(INSERT_PRODUCT_SPECS, function(err, result){
// 				if(err){
// 					return cb(err);
// 				}
// 				cb()
// 			});
			
// 		}
		
// 	}.bind(this));
// };




Product.save = function(newProduct, cb){
	var INSERT_PRODUCT = 'INSERT INTO shoppingdb.product(id,name, price, imgPath) VALUES(' 
				+ 'NULL,"' + newProduct.name + '", "'
				+ newProduct.price + '", "'
				+ newProduct.imgPath + '")';
	database.query(INSERT_PRODUCT, function(err, result){
		if(err){
			cb(err);
		}
		else{
			var SELECT_ID = '(SELECT id FROM shoppingdb.product WHERE name="'+newProduct.name+'")';
			var INSERT_PRODUCT_SPECS = 'INSERT INTO shoppingdb.product_specs'
				+ '(productId,screen, os, backCamera, frontCamera,' 
				+ 'cpu, ram, memory, sim, battery) '
				+ 'VALUES('+ SELECT_ID +', "' + newProduct.screen + '",'
				+ '"' + newProduct.os + '", "' + newProduct.backCamera + '", "' + newProduct.frontCamera + '",'
				+ '"' + newProduct.cpu + '", "' + newProduct.ram + '", "' + newProduct.memory + '",'
				+ '"' + newProduct.sim + '", "' + newProduct.battery + '")'; 
			database.query(INSERT_PRODUCT_SPECS, function(err, result){
				if(err)
					cb(err);
				else
					cb()
			});
			
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

Product.getProductSpecsByName = function(name, cb){
	var SELECT_PRODUCT_SPECS = 'SELECT * FROM shoppingdb.product_specs WHERE name ="' + name+ '"';
	database.query(SELECT_PRODUCT_SPECS, function(err,result){
		if(err){
			console.log(err);
		}else if(result.length===1){
		cb(new ProductSpecs(result[0]));
	}else
		cb();
	});	
};

Product.getById = function(name, cb){
	var SELECT_PRICE = 'SELECT * FROM shoppingdb.product WHERE name = "' + name + '"';
	database.query(SELECT_PRICE, function(err, result){
		if(err)
			console.log(err);
		else if(result.length==1)
			cb(new Product(result[0]));
		else
			cb();

	});
};

module.exports = Product;
var database = require('./database');

function Product(product){
	this.name = product.name;
	this.slogan = product.slogan;
	this.screen = product.screen;
	this.os = product.os;
	this.backCamera = product.backCamera;
	this.fronCamera = product.fronCamera;
	this.cpu = product.cpu;
	this.ram = product.ram;
	this.memory = product.memory;
	this.sim = product.sim;
	this.battery = product.battery;
	this.price = product.price;
	this.imgPath = product.imgPath;
}

Product.prototype.save = function(cb){
	var INSERT_PRODUCT = 'INSERT INTO shoppingdb.product(id, name) ' 
				+ 'VALUES(NULL, "' + this.name + '")';
	database.query(INSERT_PRODUCT, function(err, result){
		if(err){
			return cb(err);
		}
		else{
			var SELECT_ID = '(SELECT id FROM shoppingdb.product WHERE name="'+this.name+'")';
			var INSERT_PRODUCT_SPECS = 'INSERT INTO shoppingdb.product_specs'
				+ '(id, slogan, screen, os, back_camera, front_camera,' 
				+ 'cpu, ram, memory, sim, battery, price, img_path) '
				+ 'VALUES('+ SELECT_ID +', "' + this.slogan + '", "' + this.screen + '",'
				+ '"' + this.os + '", "' + this.backCamera + '", "' + this.fronCamera + '",'
				+ '"' + this.cpu + '", "' + this.ram + '", "' + this.memory + '",'
				+ '"' + this.sim + '", "' + this.battery + '", "' + this.price + '",' 
				+ '"' + this.imgPath + '")';
			database.query(INSERT_PRODUCT_SPECS, function(err, result){
				if(err){
					return cb(err);
				}
				cb()
			});
			
		}
		
	}.bind(this));
};

Product.getIdByName = function(name, cb){
	var SELECT_ID = 'SELECT id FROM shoppingdb.product WHERE name="' + name +'"';
	database.query(SELECT_ID, function(err, result){
		if(err){
			cb(err);
		}
		else if(result.length===1){
			// console.log('id: ',result[0]);
			cb(false, result[0].id);
		}

	})
};

Product.getProductSpecsByName = function(name, cb){
	Product.getIdByName(name, function(err, id){
		if(err){
			cb(err);
		}
		else{
			var SELECT_SPECS = 'SELECT * FROM shoppingdb.product_specs WHERE id=' + id;
			database.query(SELECT_SPECS, function(err, result){
				if(err){
					cb(err);
				}
				if(result.length===1){
					cb(false, result[0]);
				}
			});	
		}
	});
};

module.exports = Product;
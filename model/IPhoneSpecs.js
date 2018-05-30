module.exports = IPhoneSpecs;
var database = require('../database');

function IPhoneSpecs(){
	
}

IPhoneSpecs.prototype.init = function(specs){
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

IPhoneSpecs.prototype.getData = function(productId,cb){
	var SELECT_SPECS = 'SELECT * FROM shoppingdb.iPhoneSpecs WHERE productId =' + productId;
	database.query(SELECT_SPECS, function(err,result){
		if(err){
			console.log(err);
			return cb(err);
		}
		if(result.length == 1){
			var specs = result[0];
			console.log(specs);
			this.init(specs);
		}
			cb();
	}.bind(this));	
}

IPhoneSpecs.prototype.save = function(productId, cb){
	var INSERT_SPECS = 'INSERT INTO shoppingdb.iPhoneSpecs'
		+ '(productId,screen, os, backCamera, frontCamera,' 
		+ 'cpu, ram, memory, sim, battery) '
		+ 'VALUES('+ productId +', "' + this.screen + '",'
		+ '"' + this.os + '", "' + this.backCamera + '", "' + this.frontCamera + '",'
		+ '"' + this.cpu + '", "' + this.ram + '", "' + this.memory + '",'
		+ '"' + this.sim + '", "' + this.battery + '")'; 
	database.query(INSERT_SPECS, function(err){
		if(err){
			console.log(err);
			cb(err);
		}else{
			cb();
		}
	});
}




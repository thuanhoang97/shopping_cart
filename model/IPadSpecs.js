module.exports = IPadSpecs;
var database = require('../database');

function IPadSpecs(){
	
}

IPadSpecs.prototype.init = function(specs){
	this.screen = specs.screen;
	this.os = specs.os;
	this.backCamera = specs.backCamera;
	this.frontCamera = specs.frontCamera;
	this.ram = specs.ram;
	this.cpu = specs.cpu;
	this.memory = specs.memory;
	this.network = specs.network;
}

IPadSpecs.prototype.getData = function(productId,cb){
	var SELECT_SPECS = 'SELECT * FROM shoppingdb.iPadSpecs WHERE productId =' + productId;
	database.query(SELECT_SPECS, function(err,result){
		if(err){
			console.log(err);
			return cb(err);
		}
		if(result.length == 1){
			var specs = result[0];
			this.init(specs);
		}
			cb();
	}.bind(this));	
}

IPadSpecs.prototype.save = function(productId, cb){
	var INSERT_SPECS = 'INSERT INTO shoppingdb.iPadSpecs'
		+ '(productId,screen, os, backCamera, frontCamera,' 
		+ 'cpu, ram,  memory, network) '
		+ 'VALUES('+ productId +', "' + this.screen + '",'
		+ '"' + this.os + '", "' + this.backCamera + '", "' + this.frontCamera + '",'
		+ '"' + this.cpu + '", "' + this.ram + '", "' +  this.memory + '", "' + this.network + '")'; 
	database.query(INSERT_SPECS, function(err){
		if(err){
			console.log(err);
			cb(err);
		}else{
			cb();
		}
	});
}


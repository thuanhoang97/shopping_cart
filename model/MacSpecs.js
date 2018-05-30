module.exports = MacSpecs;
var database = require('../database');

function MacSpecs(){
	
}

MacSpecs.prototype.init = function(specs){
	this.screen = specs.screen;
	this.os = specs.os;
	this.cpu = specs.cpu;
	this.ram = specs.ram;
	this.hardDrive = specs.hardDrive;
	this.connector = specs.connector;
	this.design = specs.design;
	this.size = specs.size;
}

MacSpecs.prototype.getData = function(productId,cb){
	var SELECT_SPECS = 'SELECT * FROM shoppingdb.macSpecs WHERE productId =' + productId;
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

MacSpecs.prototype.save = function(productId, cb){
	var INSERT_SPECS = 'INSERT INTO shoppingdb.macSpecs'
		+ '(productId,screen, os, cpu, ram, hardDrive, connector, design, size) '
		+ 'VALUES('+ productId +', "' + this.screen + '",'
		+ '"' + this.os + '", "'  + this.cpu + '", "' + this.ram + '", "' + this.hardDrive + '",'
		+ '"' + this.connector + '", "' + this.design + '", "' + this.size + '")'; 
	database.query(INSERT_SPECS, function(err){
		if(err){
			console.log(err);
			cb(err);
		}else{
			cb();
		}
	});
}


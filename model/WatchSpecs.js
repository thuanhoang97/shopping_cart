module.exports = WatchSpecs;
var database = require('../database');

function WatchSpecs(){
	
}

WatchSpecs.prototype.init = function(specs){
	this.screen = specs.screen;
	this.glass = specs.glass;
	this.material = specs.material;
	this.waterproof = specs.waterproof;
	this.deviceConnect = specs.deviceConnect;
	this.timeUse = specs.timeUse;
}

WatchSpecs.prototype.getData = function(productId,cb){
	var SELECT_SPECS = 'SELECT * FROM shoppingdb.watchSpecs WHERE productId =' + productId;
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

WatchSpecs.prototype.save = function(productId, cb){
	var INSERT_SPECS = 'INSERT INTO shoppingdb.watchSpecs'
		+ '(productId,screen, glass, material, waterproof, deviceConnect, timeUse) '
		+ 'VALUES('+ productId +', "' + this.screen + '",'
		+ '' + this.glass + ', "'  + this.material + '", ' + this.waterproof + ','
		+ '"' + this.deviceConnect + '", "' + this.timeUse + '")'; 
	database.query(INSERT_SPECS, function(err){
		if(err){
			console.log(err);
			cb(err);
		}else{
			cb();
		}
	});
}


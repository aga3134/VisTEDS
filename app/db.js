
var Sequelize = require('sequelize');
var Config = require('../config');
var ReadLine = require('readline');
var fs = require('fs-extra');
var iconv = require('iconv-lite');

var db = {};
var mysql = process.env.MYSQL_SERVER || '127.0.0.1';

db.Init = function(){
	db.sequelize = new Sequelize(Config.mysqlAuth.dbName, Config.mysqlAuth.username, Config.mysqlAuth.password,
								 {host: mysql, port: '3306', logging: false});
	db.PointSource = db.sequelize.import(__dirname + "./../db/pointSource.js");
	db.LineSource = db.sequelize.import(__dirname + "./../db/lineSource.js");
	db.AreaSource = db.sequelize.import(__dirname + "./../db/areaSource.js");
	db.BioSource = db.sequelize.import(__dirname + "./../db/bioSource.js");
	db.NH3Source = db.sequelize.import(__dirname + "./../db/nh3Source.js");
	db.PointGrid = db.sequelize.import(__dirname + "./../db/pointGrid.js");
	db.LineGrid = db.sequelize.import(__dirname + "./../db/lineGrid.js");
	db.AreaGrid = db.sequelize.import(__dirname + "./../db/areaGrid.js");
	db.BioGrid = db.sequelize.import(__dirname + "./../db/bioGrid.js");
	db.NH3Grid = db.sequelize.import(__dirname + "./../db/nh3Grid.js");
	
	var syncOp = {};
	syncOp.force = false;
    db.sequelize.sync(syncOp);
}

module.exports = db;

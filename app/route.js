var DB = require("./db");
var version = "1.0.0";
var levelNum = 6;
var gridPerUnit = 100;

module.exports = function(app){
	
	DB.Init();

	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});

	app.get("/point-source", function(req, res){
		var attr = ['DICT_NO','TSP_EMI','PM_EMI','PM6_EMI','PM25_EMI','SOX_EMI','NOX_EMI','THC_EMI',
			'NMHC_EMI','CO_EMI','PB_EMI','WGS84_E','WGS84_N'];
		DB.PointSource.findAll({where: {"SERIAL_NO": {$lte: 1000}}, attributes: attr}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/point-grid", function(req, res){
		var level = parseInt(req.query.level);
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);
		if(!req.query.level || level < 0 || level >= levelNum) return;

		var scale = gridPerUnit/Math.pow(2,level);
		var interval = 1.0/scale;
		var query = {"LEVEL": level};
		var condition = [];
		if(minLat) condition.push({'GRID_Y': {$gte: minLat*scale}});
		if(maxLat) condition.push({'GRID_Y': {$lte: maxLat*scale}});

		if(minLng) condition.push({'GRID_X': {$gte: minLng*scale}});
		if(maxLng) condition.push({'GRID_X': {$lte: maxLng*scale}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['GRID_X','GRID_Y','TSP_EMI','PM_EMI','PM6_EMI','PM25_EMI','SOX_EMI','NOX_EMI','THC_EMI',
			'NMHC_EMI','CO_EMI','PB_EMI'];
		DB.PointGrid.findAll({where: query, attributes: attr}).then(function(data) {
			var result = {};
			result.level = level;
			for(var i=0;i<data.length;i++){
				data[i].GRID_X = (data[i].GRID_X*interval).toFixed(2);
				data[i].GRID_Y = (data[i].GRID_Y*interval).toFixed(2);
			}
			result.data = data;
			res.send(result);
		});
	});

	app.get("/line-source", function(req, res){
		var attr = ['NSC','NSC_SUB','WGS84_E','WGS84_N','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX',
			'EM_THC','EM_NMHC','EM_EXHC','EM_EHC','EM_RHC','EM_RST','EM_CO','EM_PB','EM_NH3'];
		DB.LineSource.findAll({where: {"SERIAL_NO": {$lte: 1000}}, attributes: attr}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/line-grid", function(req, res){
		var level = parseInt(req.query.level);
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);
		if(!req.query.level || level < 0 || level >= levelNum) return;

		var scale = gridPerUnit/Math.pow(2,level);
		var interval = 1.0/scale;
		var query = {"LEVEL": level};
		var condition = [];
		if(minLat) condition.push({'GRID_Y': {$gte: minLat*scale}});
		if(maxLat) condition.push({'GRID_Y': {$lte: maxLat*scale}});

		if(minLng) condition.push({'GRID_X': {$gte: minLng*scale}});
		if(maxLng) condition.push({'GRID_X': {$lte: maxLng*scale}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['GRID_X','GRID_Y','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX','EM_THC',
			'EM_NMHC','EM_EXHC','EM_EHC','EM_RHC','EM_RST','EM_CO','EM_PB','EM_NH3'];
		DB.LineGrid.findAll({where: query, attributes: attr}).then(function(data) {
			var result = {};
			result.level = level;
			for(var i=0;i<data.length;i++){
				data[i].GRID_X = (data[i].GRID_X*interval).toFixed(2);
				data[i].GRID_Y = (data[i].GRID_Y*interval).toFixed(2);
			}
			result.data = data;
			res.send(result);
		});
	});

	app.get("/area-source", function(req, res){
		var attr = ['NSC','NSC_SUB','WGS84_E','WGS84_N','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX',
			'EM_THC','EM_NMHC','EM_CO','EM_PB','EM_NH3'];
		DB.AreaSource.findAll({where: {"SERIAL_NO": {$lte: 1000}}, attributes: attr}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/area-grid", function(req, res){
		var level = parseInt(req.query.level);
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);
		if(!req.query.level || level < 0 || level >= levelNum) return;

		var scale = gridPerUnit/Math.pow(2,level);
		var interval = 1.0/scale;
		var query = {"LEVEL": level};
		var condition = [];
		if(minLat) condition.push({'GRID_Y': {$gte: minLat*scale}});
		if(maxLat) condition.push({'GRID_Y': {$lte: maxLat*scale}});

		if(minLng) condition.push({'GRID_X': {$gte: minLng*scale}});
		if(maxLng) condition.push({'GRID_X': {$lte: maxLng*scale}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['GRID_X','GRID_Y','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX','EM_THC',
			'EM_NMHC','EM_CO','EM_PB','EM_NH3'];
		DB.AreaGrid.findAll({where: query, attributes: attr}).then(function(data) {
			var result = {};
			result.level = level;
			for(var i=0;i<data.length;i++){
				data[i].GRID_X = (data[i].GRID_X*interval).toFixed(2);
				data[i].GRID_Y = (data[i].GRID_Y*interval).toFixed(2);
			}
			result.data = data;
			res.send(result);
		});
	});

	app.get("/bio-source", function(req, res){
		var attr = ['WGS84_E','WGS84_N','TOTAL_NMHC','ISO','MONO','ONMHC','MBO'];
		DB.BioSource.findAll({where: {"SERIAL_NO": {$lte: 1000}}, attributes: attr}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/bio-grid", function(req, res){
		var level = parseInt(req.query.level);
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);
		if(!req.query.level || level < 0 || level >= levelNum) return;

		var scale = gridPerUnit/Math.pow(2,level);
		var interval = 1.0/scale;
		var query = {"LEVEL": level};
		var condition = [];
		if(minLat) condition.push({'GRID_Y': {$gte: minLat*scale}});
		if(maxLat) condition.push({'GRID_Y': {$lte: maxLat*scale}});

		if(minLng) condition.push({'GRID_X': {$gte: minLng*scale}});
		if(maxLng) condition.push({'GRID_X': {$lte: maxLng*scale}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['GRID_X','GRID_Y','TOTAL_NMHC','ISO','MONO','ONMHC','MBO'];
		DB.BioGrid.findAll({where: query, attributes: attr}).then(function(data) {
			var result = {};
			result.level = level;
			for(var i=0;i<data.length;i++){
				data[i].GRID_X = (data[i].GRID_X*interval).toFixed(2);
				data[i].GRID_Y = (data[i].GRID_Y*interval).toFixed(2);
			}
			result.data = data;
			res.send(result);
		});
	});

	app.get("/nh3-source", function(req, res){
		var attr = ['NSC','NSC_SUB','WGS84_E','WGS84_N','EM_NH3'];
		DB.NH3Source.findAll({where: {"SERIAL_NO": {$lte: 1000}}, attributes: attr}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/nh3-grid", function(req, res){
		var level = parseInt(req.query.level);
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);
		if(!req.query.level || level < 0 || level >= levelNum) return;

		var scale = gridPerUnit/Math.pow(2,level);
		var interval = 1.0/scale;
		var query = {"LEVEL": level};
		var condition = [];
		if(minLat) condition.push({'GRID_Y': {$gte: minLat*scale}});
		if(maxLat) condition.push({'GRID_Y': {$lte: maxLat*scale}});

		if(minLng) condition.push({'GRID_X': {$gte: minLng*scale}});
		if(maxLng) condition.push({'GRID_X': {$lte: maxLng*scale}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['GRID_X','GRID_Y','EM_NH3'];
		DB.NH3Grid.findAll({where: query, attributes: attr}).then(function(data) {
			var result = {};
			result.level = level;
			for(var i=0;i<data.length;i++){
				data[i].GRID_X = (data[i].GRID_X*interval).toFixed(2);
				data[i].GRID_Y = (data[i].GRID_Y*interval).toFixed(2);
			}
			result.data = data;
			res.send(result);
		});
	});
}
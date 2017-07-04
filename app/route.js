var DB = require("./db");
var version = "1.0.0";
var levelNum = 7;
var gridPerUnit = 100;

module.exports = function(app){
	
	DB.Init();

	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});

	app.get("/point-source", function(req, res){
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
	
		var query = {'WGS84_N':lat, 'WGS84_E':lng};
		
		DB.PointSource.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/point-group", function(req, res){
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);

		var query = {};
		var condition = [];
		if(minLat) condition.push({'WGS84_N': {$gte: minLat}});
		if(maxLat) condition.push({'WGS84_N': {$lte: maxLat}});

		if(minLng) condition.push({'WGS84_E': {$gte: minLng}});
		if(maxLng) condition.push({'WGS84_E': {$lte: maxLng}});
		if(condition.length > 0) query.$and = condition;


		var attr = ['TSP_EMI','PM_EMI','PM6_EMI','PM25_EMI','SOX_EMI','NOX_EMI','THC_EMI',
			'NMHC_EMI','CO_EMI','PB_EMI','WGS84_E','WGS84_N'];
		DB.PointGroup.findAll({where: query, attributes: attr}).then(function(data) {
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
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
		
		var query = {'WGS84_N':lat, 'WGS84_E':lng};
		
		DB.LineSource.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/line-group", function(req, res){
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);

		var query = {};
		var condition = [];
		if(minLat) condition.push({'WGS84_N': {$gte: minLat}});
		if(maxLat) condition.push({'WGS84_N': {$lte: maxLat}});

		if(minLng) condition.push({'WGS84_E': {$gte: minLng}});
		if(maxLng) condition.push({'WGS84_E': {$lte: maxLng}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['WGS84_E','WGS84_N','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX',
			'EM_THC','EM_NMHC','EM_EXHC','EM_EHC','EM_RHC','EM_RST','EM_CO','EM_PB','EM_NH3'];
		DB.LineGroup.findAll({where: query, attributes: attr}).then(function(data) {
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
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
		
		var query = {'WGS84_N':lat, 'WGS84_E':lng};
		
		DB.AreaSource.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});


	app.get("/area-group", function(req, res){
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);

		var query = {};
		var condition = [];
		if(minLat) condition.push({'WGS84_N': {$gte: minLat}});
		if(maxLat) condition.push({'WGS84_N': {$lte: maxLat}});

		if(minLng) condition.push({'WGS84_E': {$gte: minLng}});
		if(maxLng) condition.push({'WGS84_E': {$lte: maxLng}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['WGS84_E','WGS84_N','EM_TSP','EM_PM','EM_PM6','EM_PM25','EM_SOX','EM_NOX',
			'EM_THC','EM_NMHC','EM_CO','EM_PB','EM_NH3'];
		DB.AreaGroup.findAll({where: query, attributes: attr}).then(function(data) {
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
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
		
		var query = {'WGS84_N':lat, 'WGS84_E':lng};
		
		DB.BioSource.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/bio-group", function(req, res){
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);

		var query = {};
		var condition = [];
		if(minLat) condition.push({'WGS84_N': {$gte: minLat}});
		if(maxLat) condition.push({'WGS84_N': {$lte: maxLat}});

		if(minLng) condition.push({'WGS84_E': {$gte: minLng}});
		if(maxLng) condition.push({'WGS84_E': {$lte: maxLng}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['WGS84_E','WGS84_N','TOTAL_NMHC','ISO','MONO','ONMHC','MBO'];
		DB.BioGroup.findAll({where: query, attributes: attr}).then(function(data) {
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
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
		
		var query = {'WGS84_N':lat, 'WGS84_E':lng};
		
		DB.NH3Source.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/nh3-group", function(req, res){
		var minLat = parseFloat(req.query.minLat);
		var maxLat = parseFloat(req.query.maxLat);
		var minLng = parseFloat(req.query.minLng);
		var maxLng = parseFloat(req.query.maxLng);

		var query = {};
		var condition = [];
		if(minLat) condition.push({'WGS84_N': {$gte: minLat}});
		if(maxLat) condition.push({'WGS84_N': {$lte: maxLat}});

		if(minLng) condition.push({'WGS84_E': {$gte: minLng}});
		if(maxLng) condition.push({'WGS84_E': {$lte: maxLng}});
		if(condition.length > 0) query.$and = condition;

		var attr = ['WGS84_E','WGS84_N','EM_NH3'];
		DB.NH3Group.findAll({where: query, attributes: attr}).then(function(data) {
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

	app.get("/sum-source", function(req, res){
		var lat = req.query.lat;
		var lng = req.query.lng;
		if(!lat || !lng) return;
		
		var gridY = Math.floor(lat*gridPerUnit);
		var gridX = Math.floor(lng*gridPerUnit);
		
		var query = {'GRID_X':gridX, 'GRID_Y':gridY};
		
		DB.SumSource.findAll({where: query}).then(function(data) {
			res.send(data);
		});
	});

	app.get("/sum-grid", function(req, res){
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

		var attr = ['GRID_X','GRID_Y','TSP','PM','PM6','PM25','SOX','NOX','THC',
			'NMHC','CO','PB'];
		DB.SumGrid.findAll({where: query, attributes: attr}).then(function(data) {
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
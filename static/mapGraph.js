//grid structure: level -> tile -> data
var g_Map;
var g_PointGrid = [];
var g_LineGrid = [];
var g_AreaGrid = [];
var g_BioGrid = [];
var g_NH3Grid = [];
var g_SumGrid = [];
var g_LevelNum = 6;
var g_CurLevel = 5;
var g_FillColor = [];
g_FillColor["TSP"] = "#ff0000";
g_FillColor["PM10"] = "#ff0000";
g_FillColor["PM6"] = "#ff0000";
g_FillColor["PM25"] = "#ff0000";
g_FillColor["SOX"] = "#f49d41";
g_FillColor["NOX"] = "#0027d6";
g_FillColor["THC"] = "#847106";
g_FillColor["NMHC"] = "#847106";
g_FillColor["EXHC"] = "#847106";
g_FillColor["EHC"] = "#847106";
g_FillColor["RHC"] = "#847106";
g_FillColor["RST"] = "#847106";
g_FillColor["BIO_NMHC"] = "#2e8207";
g_FillColor["ISO"] = "#2e8207";
g_FillColor["MONO"] = "#2e8207";
g_FillColor["ONMHC"] = "#2e8207";
g_FillColor["MBO"] = "#2e8207";
g_FillColor["CO"] = "#c63da9";
g_FillColor["PB"] = "#000000";
g_FillColor["NH3"] = "#d8d63c";

g_SenseVal = [250,500,1000,2000,4000,8000];
var g_InfoWindow = new google.maps.InfoWindow();

function GetLevel(){
	var zoom = g_Map.getZoom();
	var level = 13-zoom;
	if(level > 5) level = 5;
	else if(level < 0) level = 0;
	return level;
}

function ToggleDataInMap(arr, level, show){
	var map = show?g_Map:null;
	var grid = arr[level];

	for(key in grid){	//tile
		var data = grid[key];
		for(coord in data){	//lat,lng
			if(!data[coord].shape) continue;
			data[coord].shape.setOptions({
	    		map: map
	    	});
		}
	}
}

function ClearMap(){
	for(var i=0;i<g_LevelNum;i++){
		ToggleDataInMap(g_PointGrid, i, false);
		ToggleDataInMap(g_LineGrid, i, false);
		ToggleDataInMap(g_AreaGrid, i, false);
		ToggleDataInMap(g_BioGrid, i, false);
		ToggleDataInMap(g_NH3Grid, i, false);
		ToggleDataInMap(g_SumGrid, i, false);
		g_PointGrid[i] = [];
		g_LineGrid[i] = [];
		g_AreaGrid[i] = [];
		g_BioGrid[i] = [];
		g_NH3Grid[i] = [];
		g_SumGrid[i] = [];
	}
}

function UpdateMapGrid(){
	var source = $("#selectSource").val();
	switch(source){
		case "POINT":
			LoadOrUpdateGrid("point",g_PointGrid);
			ToggleDataInMap(g_LineGrid, g_CurLevel, false);
			ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
			ToggleDataInMap(g_BioGrid, g_CurLevel, false);
			ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
			ToggleDataInMap(g_SumGrid, g_CurLevel, false);
			break;
		case "LINE":
			LoadOrUpdateGrid("line",g_LineGrid);
			ToggleDataInMap(g_PointGrid, g_CurLevel, false);
			ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
			ToggleDataInMap(g_BioGrid, g_CurLevel, false);
			ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
			ToggleDataInMap(g_SumGrid, g_CurLevel, false);
			break;
		case "AREA":
			LoadOrUpdateGrid("area",g_AreaGrid);
			ToggleDataInMap(g_PointGrid, g_CurLevel, false);
			ToggleDataInMap(g_LineGrid, g_CurLevel, false);
			ToggleDataInMap(g_BioGrid, g_CurLevel, false);
			ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
			ToggleDataInMap(g_SumGrid, g_CurLevel, false);
			break;
		case "BIO":
			LoadOrUpdateGrid("bio",g_BioGrid);
			ToggleDataInMap(g_PointGrid, g_CurLevel, false);
			ToggleDataInMap(g_LineGrid, g_CurLevel, false);
			ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
			ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
			ToggleDataInMap(g_SumGrid, g_CurLevel, false);
			break;
		case "NH3":
			LoadOrUpdateGrid("nh3",g_NH3Grid);
			ToggleDataInMap(g_PointGrid, g_CurLevel, false);
			ToggleDataInMap(g_LineGrid, g_CurLevel, false);
			ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
			ToggleDataInMap(g_BioGrid, g_CurLevel, false);
			ToggleDataInMap(g_SumGrid, g_CurLevel, false);
			break;
		case "SUM":
			LoadOrUpdateGrid("sum",g_SumGrid);
			ToggleDataInMap(g_PointGrid, g_CurLevel, false);
			ToggleDataInMap(g_LineGrid, g_CurLevel, false);
			ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
			ToggleDataInMap(g_BioGrid, g_CurLevel, false);
			ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
			break;
	}
	
}

function UpdateSenseRange(){
	var level = GetLevel();
	var sens = $("#sensitive");
	var maxV = 500*Math.pow(2,level);
	sens.attr("max",maxV);
	sens.val(g_SenseVal[level]);
	$("#sensLabel").text(sens.val());
}

function UpdateGridZoom(){
	var level = GetLevel();
	if(g_CurLevel == level) return;

	//hide data in previous level
	ToggleDataInMap(g_PointGrid, g_CurLevel, false);
	ToggleDataInMap(g_LineGrid, g_CurLevel, false);
	ToggleDataInMap(g_AreaGrid, g_CurLevel, false);
	ToggleDataInMap(g_BioGrid, g_CurLevel, false);
	ToggleDataInMap(g_NH3Grid, g_CurLevel, false);
	ToggleDataInMap(g_SumGrid, g_CurLevel, false);

	g_CurLevel = level;
	
	UpdateSenseRange();
}

function ExtractData(source, d){
	var obj = {};
	switch(source){
		case "point":
			obj.TSP = d.TSP_EMI;
			obj.PM10 = d.PM_EMI;
			obj.PM6 = d.PM6_EMI;
			obj.PM25 = d.PM25_EMI;
			obj.SOX = d.SOX_EMI;
			obj.NOX = d.NOX_EMI;
			obj.THC = d.THC_EMI;
			obj.NMHC = d.NMHC_EMI;
			obj.CO = d.CO_EMI;
			obj.PB = d.PB_EMI;
			break;
		case "line":
			obj.TSP = d.EM_TSP;
			obj.PM10 = d.EM_PM;
			obj.PM6 = d.EM_PM6;
			obj.PM25 = d.EM_PM25;
			obj.SOX = d.EM_SOX;
			obj.NOX = d.EM_NOX;
			obj.THC = d.EM_THC;
			obj.NMHC = d.EM_NMHC;
			obj.EXHC = d.EM_EXHC;
			obj.EHC = d.EM_EHC;
			obj.RHC = d.EM_RHC;
			obj.RST = d.EM_RST;
			obj.CO = d.EM_CO;
			obj.PB = d.EM_PB;
			obj.NH3 = d.EM_NH3;
			break;
		case "area":
			obj.TSP = d.EM_TSP;
			obj.PM10 = d.EM_PM;
			obj.PM6 = d.EM_PM6;
			obj.PM25 = d.EM_PM25;
			obj.SOX = d.EM_SOX;
			obj.NOX = d.EM_NOX;
			obj.THC = d.EM_THC;
			obj.NMHC = d.EM_NMHC;
			obj.CO = d.EM_CO;
			obj.PB = d.EM_PB;
			obj.NH3 = d.EM_NH3;
			break;
		case "bio":
			obj.BIO_NMHC = d.TOTAL_NMHC;
			obj.ISO = d.ISO;
			obj.MONO = d.MONO;
			obj.ONMHC = d.ONMHC;
			obj.MBO = d.MBO;
			break;
		case "nh3":
			obj.NH3 = d.EM_NH3;
			break;
		case "sum":
			obj.TSP = d.TSP;
			obj.PM10 = d.PM;
			obj.PM6 = d.PM6;
			obj.PM25 = d.PM25;
			obj.SOX = d.SOX;
			obj.NOX = d.NOX;
			obj.THC = d.THC;
			obj.NMHC = d.NMHC;
			obj.CO = d.CO;
			obj.PB = d.PB;
	}
	return obj;
}

function LoadOrUpdateGrid(source, arr){
	function clickFn(d){ 
		return function() {
			var pos = d.loc;
			var str = "<p>座標: ("+pos.lat().toFixed(2)+","+pos.lng().toFixed(2)+")</p>";
			var pollute = $("#selectPollute").val()
			str += "<p>"+pollute+"排放總量: "+(d[pollute]?d[pollute]+" 公噸/年":"無資料")+"</p>";

			var source = $("#selectSource").val();
			var level = GetLevel();
			if(level == 0 && source == "SUM"){
				str += "<div class='info-bt' onclick='LoadInfoDetail("+pos.lat()+","+pos.lng()+")'>詳細資料</div>";
			}
			var loc = new google.maps.LatLng(pos.lat(), pos.lng());
			g_InfoWindow.setOptions({content: str, position: loc});
			g_InfoWindow.open(g_Map);
		};
	}
	if(g_InfoWindow.getMap()){
		g_InfoWindow.setOptions({map: null});
	}

	/*for(var i=0;i<g_LevelNum;i++){
		var sum = 0;
		for(var key in g_PointGrid[i]){
			sum += Object.keys(g_PointGrid[i][key]).length;
		}
		console.log("level "+i+": "+sum);
	}*/

	var level = GetLevel();
	if(level == 0 && source != "sum"){
		var shape = source=="point"?"circle":"rect";
		return LoadOrUpdateGroup(source, arr, shape);
	}

	var bound = g_Map.getBounds();
	var minLat = bound.getSouthWest().lat();
	var minLng = bound.getSouthWest().lng();
	var maxLat = bound.getNorthEast().lat();
	var maxLng = bound.getNorthEast().lng(); 

	var step = 0.1*Math.pow(2,level);
	minLat = Math.floor(minLat/step)*step;
	minLng = Math.floor(minLng/step)*step;
	maxLat = Math.ceil(maxLat/step)*step;
	maxLng = Math.ceil(maxLng/step)*step;
	var grid = arr[level];

	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	var pollute = $("#selectPollute").val();
	if(pollute == "") return;
	var fillColor = g_FillColor[pollute];

	//update or load data of grids within bounds
	function UpdateGrid(level, lat, lng){
		var grid = arr[level];
		//truncate到小數後2位，避免誤差造成key不同
		var key = lat.toFixed(2)+","+lng.toFixed(2);

		if(grid[key]){	//update grid data in map
			for (var coord in grid[key]) {
				var curGrid = grid[key][coord];
				if(!curGrid.shape) continue;

				var d = curGrid[pollute];
		    	if(d){
		    		var opacity = d*vScale;
		    		if(opacity > 1) opacity = 1;

		    		google.maps.event.clearListeners(curGrid.shape,'click');
		    		curGrid.shape.addListener('click', clickFn(curGrid));

			    	curGrid.shape.setOptions({
			    		fillColor: fillColor,
			    		fillOpacity: opacity,
			    		map: g_Map
			    	});
		    	}
		    	else{
		    		curGrid.shape.setOptions({
			    		map: null
			    	});
		    	}
			}
		}
		else{	//load
			var param = "level="+level;
			param += "&minLat="+lat;
			param += "&minLng="+lng;
			param += "&maxLat="+(lat+step);
			param += "&maxLng="+(lng+step);
			$.get("/"+source+"-grid?"+param, function(result){
				var grid = arr[result.level];
				if(grid[key]) return;	//避免快速zoom或pan造成某些區塊同時load多次
				grid[key] = [];
				var data = result.data;
				for(var i=0;i<data.length;i++){
					var d = data[i];
					var coord = d.GRID_Y+","+d.GRID_X;
					var obj = ExtractData(source, d);
					obj.loc = new google.maps.LatLng(d.GRID_Y, d.GRID_X);

					grid[key][coord] = obj;
					
				}
				//create grid data in map
				//若get資料回傳前就zoom到別的level，就不顯示在map上
				var showMap = g_CurLevel==result.level?g_Map:null;
				var gridSize = 0.01*Math.pow(2,result.level);
				for(var coord in grid[key]) {
					var curGrid = grid[key][coord];
					var d = curGrid[pollute];

					var pLat = curGrid.loc.lat();
			    	var pLng = curGrid.loc.lng();
					var rectCoord = [
						{lat: pLat, lng: pLng},
						{lat: pLat+gridSize, lng: pLng},
						{lat: pLat+gridSize, lng: pLng+gridSize},
						{lat: pLat, lng: pLng+gridSize},
						{lat: pLat, lng: pLng}
			        ];
			        var opacity = d*vScale;
			        if(opacity > 1) opacity = 1;
			        var shape = new google.maps.Polygon({
			    		paths: rectCoord,
						strokeWeight: 0,
						fillColor: fillColor,
						fillOpacity: opacity,
						map: showMap,
						zIndex: 1
			        });

			        shape.listener = shape.addListener('click', clickFn(curGrid));

			    	curGrid.shape = shape;
				}
				
			});
		}
	}
	for(var lat=minLat; lat<=maxLat; lat+=step){
		for(var lng=minLng; lng<=maxLng; lng+=step){
			UpdateGrid(level,lat,lng);
		}
	}

}

function LoadOrUpdateGroup(source, arr, shape){
	function clickFn(d){ 
		return function() {
			var pos = d.loc;
			var str = "<p>座標: ("+pos.lat().toFixed(4)+","+pos.lng().toFixed(4)+")</p>";
			var pollute = $("#selectPollute").val();
			str += "<p>"+pollute+"排放總量: "+(d[pollute]?d[pollute]+" 公噸/年":"無資料")+"</p>";
			var source = $("#selectSource").val();
			str += "<div class='info-bt' onclick='LoadInfoDetail("+pos.lat()+","+pos.lng()+")'>詳細資料</div>";
			var loc = new google.maps.LatLng(pos.lat(), pos.lng());
			g_InfoWindow.setOptions({content: str, position: loc});
			g_InfoWindow.open(g_Map);
		};
	}
	if(g_InfoWindow.getMap()){
		g_InfoWindow.setOptions({map: null});
	}

	var bound = g_Map.getBounds();
	var minLat = bound.getSouthWest().lat();
	var minLng = bound.getSouthWest().lng();
	var maxLat = bound.getNorthEast().lat();
	var maxLng = bound.getNorthEast().lng(); 

	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;

	var step = 0.1*Math.pow(2,level);
	minLat = Math.floor(minLat/step)*step;
	minLng = Math.floor(minLng/step)*step;
	maxLat = Math.ceil(maxLat/step)*step;
	maxLng = Math.ceil(maxLng/step)*step;

	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	var pollute = $("#selectPollute").val();
	if(pollute == "") return;
	var fillColor = g_FillColor[pollute];

	function UpdateGroup(lat, lng){
		var grid = arr[0];
		//truncate到小數後2位，避免誤差造成key不同
		var key = lat.toFixed(2)+","+lng.toFixed(2);

		if(grid[key]){	//update grid data in map
			for (var coord in grid[key]) {
				var curGrid = grid[key][coord];
				if(!curGrid.shape) continue;

				var d = curGrid[pollute];
		    	if(d){
		    		var opacity = d*vScale;
		    		if(opacity > 1) opacity = 1;

		    		google.maps.event.clearListeners(curGrid.shape,'click');
		    		curGrid.shape.addListener('click', clickFn(curGrid));

			    	curGrid.shape.setOptions({
			    		fillColor: fillColor,
			    		fillOpacity: opacity,
			    		map: g_Map
			    	});
		    	}
		    	else{
		    		curGrid.shape.setOptions({
			    		map: null
			    	});
		    	}
			}
		}
		else{
			var param = "minLat="+lat;
			param += "&minLng="+lng;
			param += "&maxLat="+(lat+step);
			param += "&maxLng="+(lng+step);
			$.get("/"+source+"-group?"+param, function(data){
				var grid = arr[0];
				if(grid[key]) return;	//避免快速zoom或pan造成某些區塊同時load多次
				grid[key] = [];
				for(var i=0;i<data.length;i++){
					var d = data[i];
					var coord = d.WGS84_N+","+d.WGS84_E;
					var obj = ExtractData(source, d);
					obj.loc = new google.maps.LatLng(d.WGS84_N, d.WGS84_E);

					grid[key][coord] = obj;
				}
				//create grid data in map
				//若get資料回傳前就zoom到別的level，就不顯示在map上
				var showMap = g_CurLevel==0?g_Map:null;

				for(var coord in grid[key]) {
					var curGrid = grid[key][coord];
					var pLat = curGrid.loc.lat();
			    	var pLng = curGrid.loc.lng();
			    	
			    	var d = curGrid[pollute];
			        var opacity = d*vScale;
			        if(opacity > 1) opacity = 1;
			        var s;
			        switch(shape){
			        	case "circle":
			        		s = new google.maps.Circle({
					            fillColor: fillColor,
					            fillOpacity: opacity,
					            strokeWeight: 1,
					            strokeColor: "#999999",
					            map: showMap,
					            center: {lat: pLat, lng: pLng},
					            radius: 50,
					            zIndex: 2
					        });
			        		break;
			        	case "rect":
			        		var gridSize = 0.01;
			        		var rectCoord = [
								{lat: pLat, lng: pLng},
								{lat: pLat+gridSize, lng: pLng},
								{lat: pLat+gridSize, lng: pLng+gridSize},
								{lat: pLat, lng: pLng+gridSize},
								{lat: pLat, lng: pLng}
					        ];
					        s = new google.maps.Polygon({
					    		paths: rectCoord,
								strokeWeight: 0,
								fillColor: fillColor,
								fillOpacity: opacity,
								map: showMap,
								zIndex: 1
					        });
			        		break;
			        }
			        s.listener = s.addListener('click', clickFn(curGrid));

			        curGrid.shape = s;
				}
			});
		}
	}

	for(var lat=minLat; lat<=maxLat; lat+=step){
		for(var lng=minLng; lng<=maxLng; lng+=step){
			UpdateGroup(lat,lng);
		}
	}
}

function InitMap() {
	for(var i=0;i<g_LevelNum;i++){
		g_PointGrid.push([]);
		g_LineGrid.push([]);
		g_AreaGrid.push([]);
		g_BioGrid.push([]);
		g_NH3Grid.push([]);
		g_SumGrid.push([]);
	}
	var taiwan = new google.maps.LatLng(23.682094,120.7764642);

	g_Map = new google.maps.Map(document.getElementById('map'), {
		center: taiwan,
		zoom: 7,
		scaleControl: true,
	});

	google.maps.event.addListener(g_Map, 'click', function(event) {
	   
	});

	google.maps.event.addListener(g_Map, 'bounds_changed', function() {
		//只在一開始map ready時做一次，之後的更新交給dragend和zoom_changed事件
		UpdateMapGrid();
		//google.maps.event.clearListeners(g_Map, 'bounds_changed');
    });

	g_Map.addListener('dragend', function() {
		UpdateMapGrid();
	});

	g_Map.addListener('zoom_changed', function() {
		UpdateGridZoom();
		UpdateMapGrid();
	});
	
}


google.maps.event.addDomListener(window, 'load', InitMap);

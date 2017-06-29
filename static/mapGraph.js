//grid structure: level -> tile -> data
//zoom: 5->24x12->L6, 6->12x6->L5, 7->6x3->L4, 8->3x1.5->L3, 9->1.5x0.75->L2, 10->0.75x0.375->L1, 11->0.375x0.1875->L0
//tile size: L0->0.1, L1->0.2, L2->0.4, L3->0.8, L4->1.6, L5->3.2, L6->6.4
var g_Map;
var g_PointGrid = [];
var g_LineGrid = [];
var g_AreaGrid = [];
var g_BioGrid = [];
var g_NH3Grid = [];
var g_LevelNum = 7;
var g_CurLevel = 4;

function GetLevel(){
	var zoom = g_Map.getZoom();
	var level = 11-zoom;
	if(level > 6) level = 6;
	if(level < 0) level = 0;
	return level;
}

function HideGridInMap(arr){
	for(var i=0;i<g_LevelNum;i++){
		var grid = arr[i];
		for(key in grid){	//tile
			var data = grid[key];
			for(coord in data){	//lat,lng
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: null
		    	});
			}
		}	
	}
}

function ClearMap(){
	HideGridInMap(g_PointGrid);
	HideGridInMap(g_LineGrid);
	HideGridInMap(g_AreaGrid);
	HideGridInMap(g_BioGrid);
	HideGridInMap(g_NH3Grid);

	for(var i=0;i<g_LevelNum;i++){
		g_PointGrid[i] = [];
		g_LineGrid[i] = [];
		g_AreaGrid[i] = [];
		g_BioGrid[i] = [];
		g_NH3Grid[i] = [];
	}

}

function UpdateMapGrid(){
	var source = $("#selectSource").val();
	switch(source){
		case "ALL":
			LoadOrUpdateGrid("/point-grid",g_PointGrid);
			LoadOrUpdateGrid("/line-grid",g_LineGrid);
			LoadOrUpdateGrid("/area-grid",g_AreaGrid);
			LoadOrUpdateGrid("/bio-grid",g_BioGrid);
			LoadOrUpdateGrid("/nh3-grid",g_NH3Grid);
			break;
		case "POINT":
			LoadOrUpdateGrid("/point-grid",g_PointGrid);
			HideGridInMap(g_LineGrid);
			HideGridInMap(g_AreaGrid);
			HideGridInMap(g_BioGrid);
			HideGridInMap(g_NH3Grid);
			break;
		case "LINE":
			LoadOrUpdateGrid("/line-grid",g_LineGrid);
			HideGridInMap(g_PointGrid);
			HideGridInMap(g_AreaGrid);
			HideGridInMap(g_BioGrid);
			HideGridInMap(g_NH3Grid);
			break;
		case "AREA":
			LoadOrUpdateGrid("/area-grid",g_AreaGrid);
			HideGridInMap(g_PointGrid);
			HideGridInMap(g_LineGrid);
			HideGridInMap(g_BioGrid);
			HideGridInMap(g_NH3Grid);
			break;
		case "BIO":
			LoadOrUpdateGrid("/bio-grid",g_BioGrid);
			HideGridInMap(g_PointGrid);
			HideGridInMap(g_LineGrid);
			HideGridInMap(g_AreaGrid);
			HideGridInMap(g_NH3Grid);
			break;
		case "NH3":
			LoadOrUpdateGrid("/nh3-grid",g_NH3Grid);
			HideGridInMap(g_PointGrid);
			HideGridInMap(g_LineGrid);
			HideGridInMap(g_AreaGrid);
			HideGridInMap(g_BioGrid);
			break;
	}
	
}

function UpdateGridZoom(){
	var level = GetLevel();
	for(var i=0;i<g_LevelNum;i++){
		var showMap = i==level?g_Map:null;
		var grid = g_PointGrid[i];
		for(key in grid){
			var data = grid[key];
			for(coord in data){
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: showMap
		    	});
			}
		}
		grid = g_LineGrid[i];
		for(key in grid){
			var data = grid[key];
			for(coord in data){
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: showMap
		    	});
			}
		}
		grid = g_AreaGrid[i];
		for(key in grid){
			var data = grid[key];
			for(coord in data){
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: showMap
		    	});
			}
		}
		grid = g_BioGrid[i];
		for(key in grid){
			var data = grid[key];
			for(coord in data){
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: showMap
		    	});
			}
		}
		grid = g_NH3Grid[i];
		for(key in grid){
			var data = grid[key];
			for(coord in data){
				if(!data[coord].rect) continue;
				data[coord].rect.setOptions({
		    		map: showMap
		    	});
			}
		}
	}
	g_CurLevel = level;
}

function LoadOrUpdateGrid(url, arr){
	var bound = g_Map.getBounds();
	var minLat = bound.getSouthWest().lat();
	var minLng = bound.getSouthWest().lng();
	var maxLat = bound.getNorthEast().lat();
	var maxLng = bound.getNorthEast().lng(); 

	var level = GetLevel();
	var step = 0.1*Math.pow(2,level);
	minLat = Math.floor(minLat/step)*step;
	minLng = Math.floor(minLng/step)*step;
	maxLat = Math.ceil(maxLat/step)*step;
	maxLng = Math.ceil(maxLng/step)*step;
	var grid = arr[level];

	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	var fillColor = "#ff0000";

	//update or load data of grids within bounds
	function UpdateGrid(level, lat, lng){
		var grid = arr[level];
		//truncate到小數後2位，避免誤差造成key不同
		var key = lat.toFixed(2)+","+lng.toFixed(2);
		var pollute = $("#selectPollute").val();
		if(pollute == "") return;

		if(grid[key]){	//update grid data in map
			for (var coord in grid[key]) {
				var curGrid = grid[key][coord];
				if(!curGrid.rect) continue;

				var d = curGrid[pollute];
		    	if(d){
		    		var opacity = d*vScale;
			    	curGrid.rect.setOptions({
			    		fillOpacity: opacity,
			    		map: g_Map
			    	});
		    	}
		    	else{
		    		curGrid.rect.setOptions({
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
			$.get(url+"?"+param, function(result){
				var grid = arr[result.level];
				if(grid[key]) return;	//避免快速zoom或pan造成某些區塊同時load多次
				grid[key] = [];
				var data = result.data;
				for(var i=0;i<data.length;i++){
					var d = data[i];
					var coord = d.GRID_Y+","+d.GRID_X;
					var obj = {};
					switch(url){
						case "/point-grid":
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
						case "/line-grid":
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
						case "/area-grid":
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
						case "/bio-grid":
							obj.NMHC = d.TOTAL_NMHC;
							obj.ISO = d.ISO;
							obj.MONO = d.MONO;
							obj.ONMHC = d.ONMHC;
							obj.MBO = d.MBO;
							break;
						case "/nh3-grid":
							obj.NH3 = d.EM_NH3;
							break;
					}

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
			        var rect = new google.maps.Polygon({
			    		paths: rectCoord,
						strokeWeight: 0,
						fillColor: fillColor,
						fillOpacity: opacity,
						map: g_Map,
						zIndex: 1
			        });

			    	curGrid.rect = rect;
				}
				
			});
		}
	}
	for(var lat=minLat; lat<=maxLat; lat+=step){
		for(var lng=minLng; lng<=maxLng; lng+=step){
			UpdateGrid(level,lat,lng);
		}
	}


	/*var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	$.get("/point-source", function(data){
		for(var i=0;i<data.length;i++){
			var pLat = data[i].WGS84_N;
	    	var pLng = data[i].WGS84_E;
	    	var size = 100;

	    	var opacity = data[i].PM25_EMI*vScale;
	        if(opacity > 1) opacity = 1;
	        var circle = new google.maps.Circle({
	            fillColor: '#FF0000',
	            fillOpacity: opacity,
	            strokeWeight: 1,
	            strokeColor: '#FF0000',
	            strokeOpacity: opacity,
	            map: g_Map,
	            center: {lat: pLat, lng: pLng},
	            radius: size
	          });
		}
	});

	$.get("point-grid?level="+level,function(result){
		var gridSize = 0.01*Math.pow(2,result.level);
		var data = result.data;
		for(var i=0;i<data.length;i++){
			var pLat = parseFloat(data[i].GRID_Y);
			var pLng = parseFloat(data[i].GRID_X);
			var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+gridSize, lng: pLng},
				{lat: pLat+gridSize, lng: pLng+gridSize},
				{lat: pLat, lng: pLng+gridSize},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].PM25_EMI*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#ff0000",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
	        g_PointGrid.push(rect);
		}
	});*/
}

function UpdateLineGrid(){
	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	/*$.get("line-source",function(data){
		for(var i=0;i<data.length;i++){
			var pLat = data[i].WGS84_N;
	    	var pLng = data[i].WGS84_E;
	    	var size = 0.01;

	        var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+size, lng: pLng},
				{lat: pLat+size, lng: pLng+size},
				{lat: pLat, lng: pLng+size},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_PM25*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#ff0000",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
		}
	});*/

	$.get("line-grid?level="+level,function(result){
		var gridSize = 0.01*Math.pow(2,result.level);
		var data = result.data;
		for(var i=0;i<data.length;i++){
			var pLat = parseFloat(data[i].GRID_Y);
			var pLng = parseFloat(data[i].GRID_X);
			var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+gridSize, lng: pLng},
				{lat: pLat+gridSize, lng: pLng+gridSize},
				{lat: pLat, lng: pLng+gridSize},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_PM25*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#ff0000",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
	        g_LineGrid.push(rect);
		}
	});
}

function UpdateAreaGrid(){
	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;

	/*$.get("area-source",function(data){
		for(var i=0;i<data.length;i++){
			var pLat = data[i].WGS84_N;
	    	var pLng = data[i].WGS84_E;
	    	var size = 0.009;

	        var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+size, lng: pLng},
				{lat: pLat+size, lng: pLng+size},
				{lat: pLat, lng: pLng+size},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_PM25*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#ff0000",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
		}
	});*/

	$.get("area-grid?level="+level,function(result){
		var gridSize = 0.01*Math.pow(2,result.level);
		var data = result.data;
		for(var i=0;i<data.length;i++){
			var pLat = parseFloat(data[i].GRID_Y);
			var pLng = parseFloat(data[i].GRID_X);
			var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+gridSize, lng: pLng},
				{lat: pLat+gridSize, lng: pLng+gridSize},
				{lat: pLat, lng: pLng+gridSize},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_PM25*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#ff0000",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
	        g_AreaGrid.push(rect);
		}
	});
}

function UpdateBioGrid(){
	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;

	/*$.get("bio-source",function(data){
		for(var i=0;i<data.length;i++){
			var pLat = data[i].WGS84_N;
	    	var pLng = data[i].WGS84_E;
	    	var size = 0.009;

	        var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+size, lng: pLng},
				{lat: pLat+size, lng: pLng+size},
				{lat: pLat, lng: pLng+size},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].TOTAL_NMHC*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#00ff00",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
		}
	});*/

	$.get("bio-grid?level="+level,function(result){
		var gridSize = 0.01*Math.pow(2,result.level);
		var data = result.data;
		for(var i=0;i<data.length;i++){
			var pLat = parseFloat(data[i].GRID_Y);
			var pLng = parseFloat(data[i].GRID_X);
			var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+gridSize, lng: pLng},
				{lat: pLat+gridSize, lng: pLng+gridSize},
				{lat: pLat, lng: pLng+gridSize},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].TOTAL_NMHC*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#00ff00",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
	        g_BioGrid.push(rect);
		}
	});
}

function UpdateNH3Grid(){
	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	/*$.get("nh3-source",function(data){
		for(var i=0;i<data.length;i++){
			var pLat = data[i].WGS84_N;
	    	var pLng = data[i].WGS84_E;
	    	var size = 0.009;

	        var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+size, lng: pLng},
				{lat: pLat+size, lng: pLng+size},
				{lat: pLat, lng: pLng+size},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_NH3*vScale*100;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#0000ff",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
		}
	});*/

	$.get("nh3-grid?level="+level,function(result){
		var gridSize = 0.01*Math.pow(2,result.level);
		var data = result.data;
		for(var i=0;i<data.length;i++){
			var pLat = parseFloat(data[i].GRID_Y);
			var pLng = parseFloat(data[i].GRID_X);
			var rectCoord = [
				{lat: pLat, lng: pLng},
				{lat: pLat+gridSize, lng: pLng},
				{lat: pLat+gridSize, lng: pLng+gridSize},
				{lat: pLat, lng: pLng+gridSize},
				{lat: pLat, lng: pLng}
	        ];
	        var opacity = data[i].EM_NH3*vScale;
	        if(opacity > 1) opacity = 1;
	        var rect = new google.maps.Polygon({
	    		paths: rectCoord,
				strokeWeight: 0,
				fillColor: "#0000ff",
				fillOpacity: opacity,
				map: g_Map,
				zIndex: 1
	        });
	        g_NH3Grid.push(rect);
		}
	});
}

function InitMap() {
	for(var i=0;i<g_LevelNum;i++){
		g_PointGrid.push([]);
		g_LineGrid.push([]);
		g_AreaGrid.push([]);
		g_BioGrid.push([]);
		g_NH3Grid.push([]);
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
		UpdateMapGrid();
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
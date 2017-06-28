var g_PointGrid = [];
var g_LineGrid = [];
var g_AreaGrid = [];
var g_BioGrid = [];
var g_NH3Grid = [];


function GetLevel(){
	var zoom = map.getZoom();
	var level = 11-zoom;
	if(level > 6) level = 6;
	if(level < 0) level = 0;
	return level;
}

function ClearMap(){
	for(var key in g_PointGrid){
		g_PointGrid[key].setOptions({
    		map: null
    	});
	}
	for(var key in g_LineGrid){
		g_LineGrid[key].setOptions({
    		map: null
    	});
	}
	for(var key in g_AreaGrid){
		g_AreaGrid[key].setOptions({
    		map: null
    	});
	}
	for(var key in g_BioGrid){
		g_BioGrid[key].setOptions({
    		map: null
    	});
	}
	for(var key in g_NH3Grid){
		g_NH3Grid[key].setOptions({
    		map: null
    	});
	}
}

function UpdateMapGrid(){
	ClearMap();
	var source = $("#selectSource").val();
	switch(source){
		case "ALL":
			UpdatePointGrid();
			UpdateLineGrid();
			UpdateAreaGrid();
			UpdateBioGrid();
			UpdateNH3Grid();
			break;
		case "POINT":
			UpdatePointGrid();
			break;
		case "LINE":
			UpdateLineGrid();
			break;
		case "AREA":
			UpdateAreaGrid();
			break;
		case "BIO":
			UpdateBioGrid();
			break;
		case "NH3":
			UpdateNH3Grid();
			break;
	}
	
}

function UpdateGridZoom(){

}

function UpdatePointGrid(){
	var level = GetLevel();
	var sensitive = $("#sensitive").val();
	var vScale = 1.0/sensitive;
	/*$.get("/point-source", function(data){
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
	            map: map,
	            center: {lat: pLat, lng: pLng},
	            radius: size
	          });
		}
	});*/

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
				map: map,
				zIndex: 1
	        });
	        g_PointGrid.push(rect);
		}
	});
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
				map: map,
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
				map: map,
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
				map: map,
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
				map: map,
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
				map: map,
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
				map: map,
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
				map: map,
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
				map: map,
				zIndex: 1
	        });
	        g_NH3Grid.push(rect);
		}
	});
}

function InitMap() {
	var taiwan = new google.maps.LatLng(23.682094,120.7764642);

	map = new google.maps.Map(document.getElementById('map'), {
		center: taiwan,
		zoom: 7,
		scaleControl: true,
	});

	google.maps.event.addListener(map, 'click', function(event) {
	   
	});

	map.addListener('dragend', function() {
		UpdateMapGrid();
	});

	map.addListener('zoom_changed', function() {
		UpdateGridZoom();
		UpdateMapGrid();
	});
	
}


google.maps.event.addDomListener(window, 'load', InitMap);
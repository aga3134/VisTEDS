

function InitMap() {
	var taiwan = new google.maps.LatLng(23.682094,120.7764642);

	map = new google.maps.Map(document.getElementById('map'), {
	  center: taiwan,
	  zoom: 7,
	  scaleControl: true,
	});

	var vScale = 1.0/1000;
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

	$.get("point-grid?level=1",function(result){
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
		}
	});

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

	/*$.get("line-grid?level=3",function(result){
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
		}
	});*/

	$.get("area-source",function(data){
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
	});

	/*$.get("area-grid?level=3",function(result){
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
		}
	});*/

	$.get("bio-source",function(data){
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
	});

	/*$.get("bio-grid?level=3",function(result){
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
		}
	});*/

	$.get("nh3-source",function(data){
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
	});

	/*$.get("nh3-grid?level=3",function(result){
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
		}
	});*/
}


google.maps.event.addDomListener(window, 'load', InitMap);
var g_TransTime = 500;

//param: graphID, infoID, width, height, data
function DrawPieChart(param){
	var svg = d3.select("#"+param.graphID);
	if(svg.select(".group").empty()){
		svg = svg.append("g")
			.attr("class","group")
    		.attr("transform", "translate(" + param.width*0.5 + "," + param.height*0.5 + ")");
	}
	else{
		svg = svg.select(".group");
	}

	var radius = Math.min(param.width,param.height)*0.5;
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	var color = d3.scale.category20();

	var totalNum = 0;
	for(var i=0;i<param.data.length;i++){
		totalNum += param.data[i].value;
	}
	var info = $("#"+param.infoID);
	info.html("排放總數: "+totalNum.toFixed(2)+"公噸/年");

	function UpdateText(d,i){
		if(d){
			var str = d.data.key;
			str += "，數量: "+d.value.toFixed(2)+"公噸/年";
			str += "，百分比: "+Math.floor(100*d.value/totalNum)+"%";
			info.html(str);
		}
		else{
			info.html("排放總數: "+totalNum.toFixed(2)+"公噸/年");
		}
		
	}

	var update = svg.selectAll(".arc").data(pie(param.data));

	update.enter().append("g")
		.attr("class", "arc")
		.append("path")
		.each(function(d) { this.current = d; });

	update.select("path")
		.on("mouseover", function(d,i) {
			d3.select(this).style("stroke", "green");
			UpdateText(d,i);
		})
		.on("mouseout", function(d,i) {
			d3.select(this).style("stroke", "none");
			UpdateText();
		})
		.transition()
       	.duration(g_TransTime)
       	.style("fill", function(d,i) { return color(i); })
		.attr("stroke-width",2)
		.attrTween('d', function(d) {
			var i = d3.interpolate(this.current, d);
			this.current = i(0);
			return function(t) {
				return arc(i(t));;
			};
		});
}

//param: graphID, infoID, width, height, data, offsetX, offsetY
function DrawBarChart(param){
	var rectH = (param.height-param.offsetY)/param.data.length;

	var color = d3.scale.category20();

	var totalNum = 0;
	var maxValue = 0;
	for(var i=0;i<param.data.length;i++){
		var value = param.data[i].value;
		totalNum += value;
		if(value > maxValue) maxValue = value;
	}
	var info = $("#"+param.infoID);
	info.html("排放總數: "+totalNum.toFixed(2)+"公噸/年");

	var color = d3.scale.category20();

	//draw graph
	var svg = d3.select("#"+param.graphID);
	if(svg.select(".group").empty()){
		svg = svg.append("g").attr("class","group")
	}
	else{
		svg = svg.select(".group");
	}

	function UpdateText(d,i){
		if(d){
			var str = d.key;
			str += "，數量: "+d.value.toFixed(2)+"公噸/年";
			str += "，百分比: "+Math.floor(100*d.value/totalNum)+"%";
			info.html(str);
		}
		else{
			info.html("排放總數: "+totalNum.toFixed(2)+"公噸/年");
		}
		
	}

	var rect = svg.selectAll(".rect").data(param.data);

	rect.enter().append("g")
		.attr("class", "rect")
		.append("rect");

	rect.select("rect")
		.on("mouseover", function(d,i) {
			d3.select(this).style("stroke", "green");
			UpdateText(d,i);
		})
		.on("mouseout", function(d,i) {
			d3.select(this).style("stroke", "none");
			UpdateText();
		})
		.transition()
       	.duration(g_TransTime)
       	.style("fill", function(d,i) { return color(i); })
		.attr("stroke-width",2)
		.attr("width", function(d){return param.width*d.value/maxValue;})
		.attr("height", rectH)
		.attr("fill",function(d,i){return color(i);})
		.attr("x", function(d){return param.offsetX;})
		.attr("y", function(d,i){return param.offsetY+i*rectH;});

	var text = svg.selectAll(".text").data(param.data);

	text.enter().append("g")
		.attr("class", "text")
		.append("text");

	text.select("text")
		.attr("font-size","0.75em")
		.attr("fill","#ffffff")
		.attr("text-anchor","end")
		.attr("alignment-baseline", "hanging")
		.attr("x", function(d){return param.offsetX-10;})
		.attr("y", function(d,i){return param.offsetY+i*rectH;})
		.text(function(d){return d.key;})
}

function DrawGraphTotal(data){
	//console.log(data);
	var graph = $("#graphTotal");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteTotal").val();
	var graphData = [];
	graphData.push({key: "點源", value: data.POINT[pollute]});
	graphData.push({key: "線源", value: data.LINE[pollute]});
	graphData.push({key: "面源", value: data.AREA[pollute]});

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphTotal";
	param.infoID = "infoTotal";
	param.width = width;
	param.height = height;
	param.data = graphData;
	DrawPieChart(param);
}

function DrawGraphCity(data){
	//console.log(data);
	var graph = $("#graphCity");
	var width = graph.width();
	var height = graph.height();
	var offsetX = 50;
	var offsetY = 50;

	//prepare data
	var pollute = $("#selPolluteCity").val();
	var graphData = [];

	var citySum = {};
	for(var key in data){
		var value = data[key][pollute];
		var cityNo = key.substr(0,2)+"00";
		if(cityNo in citySum){
			citySum[cityNo] += value;
		}
		else{
			citySum[cityNo] = value;
		}
	}

	for(var key in citySum){
		var value = citySum[key];
		var name = (key in g_CityName)?g_CityName[key]:"不明";
		graphData.push({key: name, value: value});
	}
	graphData.sort(function(a,b){return b.value-a.value;});

	//param: graphID, infoID, width, height, data, offsetX, offsetY
	var param = {};
	param.graphID = "graphCity";
	param.infoID = "infoCity";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.offsetX = offsetX;
	param.offsetY = offsetY;
	DrawBarChart(param);
}

function DrawGraphIndustry(data){
	//console.log(data);
	var graph = $("#graphIndustry");
	var width = graph.width();
	var height = graph.height();
	var offsetX = 150;
	var offsetY = 50;

	//prepare data
	var pollute = $("#selPolluteIndustry").val();
	var graphData = [];

	var industryData = data[pollute];

	for(var i=0;i<industryData.length;i++){
		var value = industryData[i].SUM;
		var key = industryData[i].ID;
		var name = (key in g_IndustryName)?g_IndustryName[key]:key;
		graphData.push({key: name, value: value});
	}
	graphData.sort(function(a,b){return b.value-a.value;});

	//param: graphID, infoID, width, height, data, offsetX, offsetY
	var param = {};
	param.graphID = "graphIndustry";
	param.infoID = "infoIndustry";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.offsetX = offsetX;
	param.offsetY = offsetY;
	DrawBarChart(param);
}

function DrawGraphCompany(data){
	//console.log(data);
	var graph = $("#graphCompany");
	var width = graph.width();
	var height = graph.height();
	var offsetX = 250;
	var offsetY = 50;

	//prepare data
	var pollute = $("#selPolluteCompany").val();
	var graphData = [];

	var companyData = data[pollute];

	for(var i=0;i<companyData.length;i++){
		var value = companyData[i].SUM;
		var key = companyData[i].NAME;
		graphData.push({key: key, value: value});
	}
	graphData.sort(function(a,b){return b.value-a.value;});

	//param: graphID, infoID, width, height, data, offsetX, offsetY
	var param = {};
	param.graphID = "graphCompany";
	param.infoID = "infoCompany";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.offsetX = offsetX;
	param.offsetY = offsetY;
	DrawBarChart(param);
}

function DrawGraphTraffic(data){
	//console.log(data);
	var graph = $("#graphTraffic");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteTraffic").val();
	var graphData = [];
	for(key in data){
		var name = (key in g_CarType)?g_CarType[key]:key;
		graphData.push({key: name, value: data[key][pollute]});
	}

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphTraffic";
	param.infoID = "infoTraffic";
	param.width = width;
	param.height = height;
	param.data = graphData;
	DrawPieChart(param);
}

function DrawGraphArea(data){
	//console.log(data);
	var graph = $("#graphArea");
	var width = graph.width();
	var height = graph.height();
	var offsetX = 250;
	var offsetY = 50;

	//prepare data
	var pollute = $("#selPolluteArea").val();
	var graphData = [];

	var graphData = [];
	for(key in data){
		var name = (key in g_AreaType)?g_AreaType[key]:key;
		graphData.push({key: name, value: data[key][pollute]});
	}
	graphData.sort(function(a,b){return b.value-a.value;});
	graphData = graphData.slice(0,20);	//只顯示前20名

	//param: graphID, infoID, width, height, data, offsetX, offsetY
	var param = {};
	param.graphID = "graphArea";
	param.infoID = "infoArea";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.offsetX = offsetX;
	param.offsetY = offsetY;
	DrawBarChart(param);
}
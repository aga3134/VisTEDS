var g_TransTime = 500;
var g_DrawCityType = "RANK";
var g_DrawCityID = "";
var g_DrawCitySource = "POINT";
var g_DrawDictType = "ROUGH";
var g_DrawDictID = "";
var g_DrawDictSource = "POINT";

//param: title, graphID, infoID, width, height, data, clickFn
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
	var inRadius = 0;
	if(param.title){
		inRadius = 60;
		svg.append("text")
			.attr("fill","#ffffff")
			.attr("text-anchor","middle")
			.attr("alignment-baseline", "middle")
			.attr("x", 0)
			.attr("y", 0)
			.text(param.title);
	}

	var radius = Math.min(param.width,param.height)*0.5;
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(inRadius);

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
			d3.select(this).style("stroke", "yellow");
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

	if(param.clickFn){
		update.select("path").on("click", param.clickFn);
	}
}

//param: graphID, infoID, width, height, data, offsetX, offsetY, clickFn
function DrawBarChart(param){
	var rectH = (param.height-param.offsetY)/param.data.length;
	var rectW = param.width-param.offsetX-10;

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
			d3.select(this).style("stroke", "yellow");
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
		.attr("width", function(d){return rectW*d.value/maxValue;})
		.attr("height", rectH)
		.attr("fill",function(d,i){return color(i);})
		.attr("x", function(d){return param.offsetX;})
		.attr("y", function(d,i){return param.offsetY+i*rectH;});

	if(param.clickFn){
		rect.select("rect").on("click", param.clickFn);
	}

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

//處理縣市合併
function CheckCityMerge(no){
	var id = no;
	if(no == "36"){	//台中
		id = "17";
	}
	if(no == "41"){	//台南
		id = "21";
	}
	if(no == "42"){	//高雄
		id = "02";
	}
	return id;
}

function GetCityMergeArr(no){
	var arr = [no];
	switch(no){
		case "36": arr.push("17"); break;
		case "17": arr.push("36"); break;
		case "41": arr.push("21"); break;
		case "21": arr.push("41"); break;
		case "42": arr.push("02"); break;
		case "02": arr.push("42"); break;
	}
	return arr;
}

function CityBackClick(){
	var graph = $("#graphCity");
	graph.html("");
	switch(g_DrawCityType){
		case "RANK":
			break;
		case "RATIO":
			g_DrawCityType = "RANK";
			$("#backCity").css("display","none");
			break;
		case "DETAIL":
			g_DrawCityType = "RATIO";
			break;
	}
	DrawGraphCity(g_StatData.CITY);
}

function DrawCityRank(data){
	var graph = $("#graphCity");
	var width = graph.width();
	var height = graph.height();
	var offsetX = 60;
	var offsetY = 50;

	//prepare data
	var pollute = $("#selPolluteCity").val();
	var graphData = [];

	var citySum = {};
	for(var key in data){
		var value = 0;
		if(data[key]["POINT"][pollute]) value += data[key]["POINT"][pollute];
		if(data[key]["LINE"][pollute]) value += data[key]["LINE"][pollute];
		if(data[key]["AREA"][pollute]) value += data[key]["AREA"][pollute];
		var cityNo = CheckCityMerge(key.substr(0,2)) + "00";
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
		graphData.push({key: name, value: value, id: key});
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
	param.clickFn = function(d){
		graph.html("");
		g_DrawCityType = "RATIO";
		g_DrawCityID = d.id;
		$("#backCity").css("display","block");
		DrawGraphCity(data);
	}
	DrawBarChart(param);
}

function DrawCityRatio(data){
	var graph = $("#graphCity");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteCity").val();
	var graphData = [];

	var citySum = {"POINT":0, "LINE":0, "AREA":0};
	var cityName = g_CityName[g_DrawCityID];
	for(var key in data){
		var cityNo = CheckCityMerge(key.substr(0,2)) + "00";
		if(cityNo == g_DrawCityID){
			if(data[key]["POINT"][pollute]) citySum["POINT"] += data[key]["POINT"][pollute];
			if(data[key]["LINE"][pollute]) citySum["LINE"] += data[key]["LINE"][pollute];
			if(data[key]["AREA"][pollute]) citySum["AREA"] += data[key]["AREA"][pollute];
		}
	}

	graphData.push({key: "點源", value: citySum["POINT"], source: "POINT"});
	graphData.push({key: "線源", value: citySum["LINE"], source: "LINE"});
	graphData.push({key: "面源", value: citySum["AREA"], source: "AREA"});

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphCity";
	param.infoID = "infoCity";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.title = cityName;
	param.clickFn = function(d){
		graph.html("");
		g_DrawCityType = "DETAIL";
		g_DrawCitySource = d.data.source;
		$("#backCity").css("display","block");
		DrawGraphCity(data);
	}
	DrawPieChart(param);
}

function DrawCityDetail(){
	var no = g_DrawCityID.substr(0,2);
	var cityArr = GetCityMergeArr(no);
	var mergeData = {};

	function DrawGraph(){
		var graph = $("#graphCity");
		var width = graph.width();
		var height = graph.height();
		var offsetX = 220;
		var offsetY = 50;

		var graphData = [];
		for(var key in mergeData){
			graphData.push({key: key, value: mergeData[key]});
		}
		graphData.sort(function(a,b){return b.value-a.value;});
		graphData = graphData.slice(0,20);	//取前20名

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

	function MergeData(arr, i){
		if(i >= arr.length) return DrawGraph();

		var cityID = arr[i];
		$.get("data/city_"+cityID+".json", function(data){
			//console.log(data);

			var pollute = $("#selPolluteCity").val();
			
			for(var key in data){
				var source = data[key][g_DrawCitySource][pollute];
				for(var j=0;j<source.length;j++){
					var d = source[j];
					var id;
					switch(g_DrawCitySource){
						case "POINT": id = d.NAME; break;
						case "LINE": id = g_CarType[d.ID]?g_CarType[d.ID]:d.ID; break;
						case "AREA": id = g_AreaType[d.ID]?g_AreaType[d.ID]:d.ID; break;
					}

					if(id in mergeData){
						mergeData[id] += d.SUM;
					}
					else{
						mergeData[id] = d.SUM;
					}
				}
			}
			MergeData(arr, i+1);
		});
	}
	MergeData(cityArr, 0);

}

function DrawGraphCity(data){
	//console.log(data);
	switch(g_DrawCityType){
		case "RANK":
			DrawCityRank(data);
			break;
		case "RATIO":
			DrawCityRatio(data);
			break;
		case "DETAIL":
			DrawCityDetail();
			break;
	}
}

function DictBackClick(){
	var graph = $("#graphDict");
	graph.html("");
	switch(g_DrawDictType){
		case "ROUGH":
			break;
		case "FINE":
			g_DrawDictType = "ROUGH";
			$("#backDict").css("display","none");
			break;
		case "SOURCE":
			g_DrawDictID = CheckCityMerge(g_DrawDictID.substr(0,2))+"00";
			g_DrawDictType = "FINE";
			break;
		case "DETAIL":
			g_DrawDictType = "SOURCE";
			break;
	}
	DrawGraphDict(g_StatData.CITY);
}

function DrawDictRough(data){
	var graph = $("#graphDict");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteDict").val();
	var graphData = [];

	var dictSum = {};
	for(var key in data){
		var value = 0;
		if(data[key]["POINT"][pollute]) value += data[key]["POINT"][pollute];
		if(data[key]["LINE"][pollute]) value += data[key]["LINE"][pollute];
		if(data[key]["AREA"][pollute]) value += data[key]["AREA"][pollute];
		var dictNo = CheckCityMerge(key.substr(0,2)) + "00";
		if(dictNo in dictSum){
			dictSum[dictNo] += value;
		}
		else{
			dictSum[dictNo] = value;
		}
	}

	for(var key in dictSum){
		var value = dictSum[key];
		var name = (key in g_CityName)?g_CityName[key]:"不明";
		graphData.push({key: name, value: value, id: key});
	}
	graphData.sort(function(a,b){return b.value-a.value;});

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphDict";
	param.infoID = "infoDict";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.clickFn = function(d){
		graph.html("");
		g_DrawDictType = "FINE";
		$("#backDict").css("display","block");
		g_DrawDictID = d.data.id;
		DrawGraphDict(data);
	}
	DrawPieChart(param);
}

function DrawDictFine(data){
	var graph = $("#graphDict");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteDict").val();
	var graphData = [];

	var dictSum = {};
	for(var key in data){
		var dictNo = CheckCityMerge(key.substr(0,2)) + "00";
		if(g_DrawDictID == dictNo){
			var value = 0;
			if(data[key]["POINT"][pollute]) value += data[key]["POINT"][pollute];
			if(data[key]["LINE"][pollute]) value += data[key]["LINE"][pollute];
			if(data[key]["AREA"][pollute]) value += data[key]["AREA"][pollute];
			
			if(key in dictSum){
				dictSum[key] += value;
			}
			else{
				dictSum[key] = value;
			}
		}
	}

	for(var key in dictSum){
		var value = dictSum[key];
		var name = (key in g_CityName)?g_CityName[key]:"不明";
		graphData.push({key: name, value: value, id: key});
	}
	graphData.sort(function(a,b){return b.value-a.value;});

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphDict";
	param.infoID = "infoDict";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.title = g_CityName[g_DrawDictID];
	param.clickFn = function(d){
		graph.html("");
		g_DrawDictType = "SOURCE";
		g_DrawDictID = d.data.id;
		DrawGraphDict(data);
	}
	DrawPieChart(param);
}

function DrawDictSource(data){
	var graph = $("#graphDict");
	var width = graph.width();
	var height = graph.height();

	//prepare data
	var pollute = $("#selPolluteDict").val();
	var graphData = [];

	var dict = data[g_DrawDictID];
	if(dict["POINT"][pollute]){
		graphData.push({key: "點源", value: dict["POINT"][pollute], source: "POINT"});
	}
	if(dict["LINE"][pollute]){
		graphData.push({key: "線源", value: dict["LINE"][pollute], source: "LINE"});
	}
	if(dict["AREA"][pollute]){
		graphData.push({key: "面源", value: dict["AREA"][pollute], source: "AREA"});
	}

	//param: graphID, infoID, width, height, data
	var param = {};
	param.graphID = "graphDict";
	param.infoID = "infoDict";
	param.width = width;
	param.height = height;
	param.data = graphData;
	param.title = g_CityName[g_DrawDictID];
	param.clickFn = function(d){
		graph.html("");
		g_DrawDictType = "DETAIL";
		g_DrawDictSource = d.data.source;
		DrawGraphDict(data);
	}
	DrawPieChart(param);
}

function DrawDictDetail(){
	var no = g_DrawDictID.substr(0,2);
	$.get("data/city_"+no+".json", function(data){
		//console.log(data);
		var graph = $("#graphDict");
		var width = graph.width();
		var height = graph.height();
		var offsetX = 220;
		var offsetY = 50;

		//prepare data
		var pollute = $("#selPolluteDict").val();
		var detail = data[g_DrawDictID][g_DrawDictSource][pollute];

		var graphData = [];

		for(var i=0;i<detail.length;i++){
			var d = detail[i];
			var value = d.SUM;
			var key;
			switch(g_DrawDictSource){
				case "POINT": key = d.NAME; break;
				case "LINE": key = (d.ID in g_CarType)?g_CarType[d.ID]:d.ID; break;
				case "AREA": key = (d.ID in g_AreaType)?g_AreaType[d.ID]:d.ID; break;
			}
			graphData.push({key: key, value: value});
		}

		//param: graphID, infoID, width, height, data, offsetX, offsetY
		var param = {};
		param.graphID = "graphDict";
		param.infoID = "infoDict";
		param.width = width;
		param.height = height;
		param.data = graphData;
		param.offsetX = offsetX;
		param.offsetY = offsetY;
		DrawBarChart(param);

	});
}

function DrawGraphDict(data){
	switch(g_DrawDictType){
		case "ROUGH":
			DrawDictRough(data);
			break;
		case "FINE":
			DrawDictFine(data);
			break;
		case "SOURCE":
			DrawDictSource(data);
			break;
		case "DETAIL":
			DrawDictDetail();
	}
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
	var offsetX = 220;
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
	graphData.sort(function(a,b){return b.value-a.value;});

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
	var offsetX = 180;
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
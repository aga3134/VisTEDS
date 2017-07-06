var g_AreaType = {};
var g_NH3Type = {};
var g_CarType = {};
var g_CityName = {};
var g_IndustryName = {};
var g_StatData;

function OpenControlPanel(){
	var panel = $("#controlPanel");
	if(parseInt(panel.css("left")) == 0){
		panel.css("border","2px solid yellow");
		setTimeout(function(){
			panel.css("border","none");
		}, 200);
	}
	else panel.css("left",0);
}

function CloseControlPanel(){
	$("#controlPanel").css("left",-500);	
}

function LoadIDMap(){
	function ParseData(d){
		result = {};
		var arr = d.split("\n");
		for(var i=0;i<arr.length;i++){
			var line = arr[i];
			var row = line.split(",");
			result[row[0]] = row[1];
		}
		return result;
	}
	$.get("/data/area_type.csv", function(d){
		g_AreaType = ParseData(d);
	});
	$.get("/data/nh3_type.csv", function(d){
		g_NH3Type = ParseData(d);
	});
	$.get("/data/car_type.csv", function(d){
		g_CarType = ParseData(d);
	});
	$.get("/data/city_name.csv", function(d){
		g_CityName = ParseData(d);
	});
	$.get("/data/industry_name.csv", function(d){
		g_IndustryName = ParseData(d);
	});
}

function GenPointTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<th>公司名稱</th>";
	str += "<th>汙染源編號</th>";
	str += "<th>TSP<br>(公噸/年)</th>";
	str += "<th>PM10<br>(公噸/年)</th>";
	str += "<th>PM6<br>(公噸/年)</th>";
	str += "<th>PM2.5<br>(公噸/年)</th>";
	str += "<th>SOx<br>(公噸/年)</th>";
	str += "<th>NOx<br>(公噸/年)</th>";
	str += "<th>THC<br>(公噸/年)</th>";
	str += "<th>NMHC<br>(公噸/年)</th>";
	str += "<th>CO<br>(公噸/年)</th>";
	str += "<th>PB<br>(公噸/年)</th>";
	str += "<th>粒狀物控制效率<br>(%)</th>";
	str += "<th>SOx控制效率<br>(%)</th>";
	str += "<th>NOx控制效率<br>(%)</th>";
	str += "<th>THC控制效率<br>(%)</th>";
	str += "<th>CO控制效率<br>(%)</th>";
	str += "<th>PB控制效率<br>(%)</th>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td title='公司名稱'>"+d.COMP_NAM+"</td>";
		str += "<td title='汙染源編號'>"+d.NO_P+"</td>";
		str += "<td title='TSP(公噸/年)'>"+d.TSP_EMI+"</td>";
		str += "<td title='PM10(公噸/年)'>"+d.PM_EMI+"</td>";
		str += "<td title='PM6(公噸/年)'>"+d.PM6_EMI+"</td>";
		str += "<td title='PM2.5(公噸/年)'>"+d.PM25_EMI+"</td>";
		str += "<td title='SOx(公噸/年)'>"+d.SOX_EMI+"</td>";
		str += "<td title='NOx(公噸/年)'>"+d.NOX_EMI+"</td>";
		str += "<td title='THC(公噸/年)'>"+d.THC_EMI+"</td>";
		str += "<td title='NMHC(公噸/年)'>"+d.NMHC_EMI+"</td>";
		str += "<td title='CO(公噸/年)'>"+d.CO_EMI+"</td>";
		str += "<td title='PB(公噸/年)'>"+d.PB_EMI+"</td>";
		str += "<td title='粒狀物控制效率(%)'>"+d.TSP_EFF+"</td>";
		str += "<td title='SOx控制效率(%)'>"+d.SOX_EFF+"</td>";
		str += "<td title='NOx控制效率(%)'>"+d.NOX_EFF+"</td>";
		str += "<td title='THC控制效率(%)'>"+d.THC_EFF+"</td>";
		str += "<td title='CO控制效率(%)'>"+d.CO_EFF+"</td>";
		str += "<td title='PB控制效率(%)'>"+d.PB_EFF+"</td>";
	}
	str += "</table>";
	return str;
}

function GenLineTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<th>車種別</th>";
	str += "<th>道路別</th>";
	str += "<th>TSP<br>(公噸/年)</th>";
	str += "<th>PM10<br>(公噸/年)</th>";
	str += "<th>PM6<br>(公噸/年)</th>";
	str += "<th>PM2.5<br>(公噸/年)</th>";
	str += "<th>SOx<br>(公噸/年)</th>";
	str += "<th>NOx<br>(公噸/年)</th>";
	str += "<th>THC<br>(公噸/年)</th>";
	str += "<th>NMHC<br>(公噸/年)</th>";
	str += "<th>HC尾氣排放<br>(公噸/年)</th>";
	str += "<th>HC蒸發損失<br>(公噸/年)</th>";
	str += "<th>HC行駛損失<br>(公噸/年)</th>";
	str += "<th>HC停等損失<br>(公噸/年)</th>";
	str += "<th>CO<br>(公噸/年)</th>";
	str += "<th>PB<br>(公噸/年)</th>";
	str += "</tr>";

	var road = {};
	road["1"] = "國道";
	road["2"] = "省道";
	road["3"] = "縣道";
	road["4"] = "市/鄉道";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td title='車種別'>"+g_CarType[d.NSC.toLowerCase()]+"</td>";
		str += "<td title='道路別'>"+road[d.NSC_SUB]+"</td>";
		str += "<td title='TSP(公噸/年)'>"+d.EM_TSP+"</td>";
		str += "<td title='PM10(公噸/年)'>"+d.EM_PM+"</td>";
		str += "<td title='PM6(公噸/年)'>"+d.EM_PM6+"</td>";
		str += "<td title='PM2.5(公噸/年)'>"+d.EM_PM25+"</td>";
		str += "<td title='SOx(公噸/年)'>"+d.EM_SOX+"</td>";
		str += "<td title='NOx(公噸/年)'>"+d.EM_NOX+"</td>";
		str += "<td title='THC(公噸/年)'>"+d.EM_THC+"</td>";
		str += "<td title='NMHC(公噸/年)'>"+d.EM_NMHC+"</td>";
		str += "<td title='HC尾氣排放(公噸/年)'>"+d.EM_EXHC+"</td>";
		str += "<td title='HC蒸發損失(公噸/年)'>"+d.EM_EHC+"</td>";
		str += "<td title='HC行駛損失(公噸/年)'>"+d.EM_RHC+"</td>";
		str += "<td title='HC停等損失(公噸/年)'>"+d.EM_RST+"</td>";
		str += "<td title='CO(公噸/年)'>"+d.EM_CO+"</td>";
		str += "<td title='PB(公噸/年)'>"+d.EM_PB+"</td>";
	}
	str += "</table>";
	return str;
}

function GenAreaTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<th>面源種類</th>";
	str += "<th>TSP<br>(公噸/年)</th>";
	str += "<th>PM10<br>(公噸/年)</th>";
	str += "<th>PM6<br>(公噸/年)</th>";
	str += "<th>PM2.5<br>(公噸/年)</th>";
	str += "<th>SOx<br>(公噸/年)</th>";
	str += "<th>NOx<br>(公噸/年)</th>";
	str += "<th>THC<br>(公噸/年)</th>";
	str += "<th>NMHC<br>(公噸/年)</th>";
	str += "<th>CO<br>(公噸/年)</th>";
	str += "<th>PB<br>(公噸/年)</th>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		var type = d.NSC;
		if(d.NSC_SUB) type += d.NSC_SUB;
		str += "<tr>";
		str += "<td title='面源種類'>"+(g_AreaType[type]?g_AreaType[type]:type)+"</td>";
		str += "<td title='TSP(公噸/年)'>"+d.EM_TSP+"</td>";
		str += "<td title='PM10(公噸/年)'>"+d.EM_PM+"</td>";
		str += "<td title='PM6(公噸/年)'>"+d.EM_PM6+"</td>";
		str += "<td title='PM2.5(公噸/年)'>"+d.EM_PM25+"</td>";
		str += "<td title='SOx(公噸/年)'>"+d.EM_SOX+"</td>";
		str += "<td title='NOx(公噸/年)'>"+d.EM_NOX+"</td>";
		str += "<td title='THC(公噸/年)'>"+d.EM_THC+"</td>";
		str += "<td title='NMHC(公噸/年)'>"+d.EM_NMHC+"</td>";
		str += "<td title='CO(公噸/年)'>"+d.EM_CO+"</td>";
		str += "<td title='PB(公噸/年)'>"+d.EM_PB+"</td>";
	}
	str += "</table>";
	return str;
}

function GenBioTable(data){
	var str = "<table>";
	str += "<tr>";
	str += "<th>總非甲烷碳氫有機氣體<br>(公噸/年)</th>";
	str += "<th>異戊二烯(Isoprene)<br>(公噸/年)</th>";
	str += "<th>單帖類(Monoterpenes)<br>(公噸/年)</th>";
	str += "<th>其他非甲烷碳氫有機氣體<br>(公噸/年)</th>";
	str += "<th>甲基-丁烯-醇(Methyl-Buten-Ol)<br>(公噸/年)</th>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td title='總非甲烷碳氫有機氣體(公噸/年)'>"+d.TOTAL_NMHC+"</td>";
		str += "<td title='異戊二烯(Isoprene)(公噸/年)'>"+d.ISO+"</td>";
		str += "<td title='單帖類(Monoterpenes)(公噸/年)'>"+d.MONO+"</td>";
		str += "<td title='其他非甲烷碳氫有機氣體(公噸/年)'>"+d.ONMHC+"</td>";
		str += "<td title='甲基-丁烯-醇(Methyl-Buten-Ol)(公噸/年)'>"+d.MBO+"</td>";
	}
	str += "</table>";
	return str;
}

function GenNH3Table(data){
	var str = "<table>";
	str += "<tr>";
	str += "<th>氨源種類</th>";
	str += "<th>NH3<br>(公噸/年)</th>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td title='氨源種類'>"+(g_NH3Type[d.NSC]?g_NH3Type[d.NSC]:d.NSC)+"</td>";
		str += "<td title='NH3(公噸/年)'>"+d.EM_NH3+"</td>";
	}
	str += "</table>";
	return str;
}

function GenSumTable(data){
	var str = "<table>";
	str += "<tr>";
	str += "<th>汙染源</th>";
	str += "<th>TSP<br>(公噸/年)</th>";
	str += "<th>PM10<br>(公噸/年)</th>";
	str += "<th>PM6<br>(公噸/年)</th>";
	str += "<th>PM2.5<br>(公噸/年)</th>";
	str += "<th>SOx<br>(公噸/年)</th>";
	str += "<th>NOx<br>(公噸/年)</th>";
	str += "<th>THC<br>(公噸/年)</th>";
	str += "<th>NMHC<br>(公噸/年)</th>";
	str += "<th>CO<br>(公噸/年)</th>";
	str += "<th>PB<br>(公噸/年)</th>";
	str += "</tr>";
	var type = {};
	type.POINT = "點源";
	type.LINE = "線源";
	type.AREA = "面源";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td title='汙染源'>"+type[d.TYPE]+"</td>";
		str += "<td title='TSP(公噸/年)'>"+d.TSP+"</td>";
		str += "<td title='PM10(公噸/年)'>"+d.PM+"</td>";
		str += "<td title='PM6(公噸/年)'>"+d.PM6+"</td>";
		str += "<td title='PM2.5(公噸/年)'>"+d.PM25+"</td>";
		str += "<td title='SOx(公噸/年)'>"+d.SOX+"</td>";
		str += "<td title='NOx(公噸/年)'>"+d.NOX+"</td>";
		str += "<td title='THC(公噸/年)'>"+d.THC+"</td>";
		str += "<td title='NMHC(公噸/年)'>"+d.NMHC+"</td>";
		str += "<td title='CO(公噸/年)'>"+d.CO+"</td>";
		str += "<td title='PB(公噸/年)'>"+d.PB+"</td>";
	}
	str += "</table>";
	return str;
}

function OpenDetailPanel(source, data){
	//console.log(data);

	var panel = $("#detailPanel");
	panel.css("display","block");
	panel.animate({"height":"90%", "opacity":1});
	var info = panel.children(".detail-info");
	switch(source){
		case "POINT":
			info.html(GenPointTable(data));
			break;
		case "LINE":
			info.html(GenLineTable(data));
			break;
		case "AREA":
			info.html(GenAreaTable(data));
			break;
		case "BIO":
			info.html(GenBioTable(data));
			break;
		case "NH3":
			info.html(GenNH3Table(data));
			break;
		case "SUM":
			info.html(GenSumTable(data));
			break;
	}
	
}

function CloseDetailPanel(){
	var panel = $("#detailPanel");
	panel.animate({"height":"0%", "opacity":0}, 400, function(){
		panel.css("display","none");
	});
}

function UpdateStatisticGraph(){
	DrawGraphTotal(g_StatData.TOTAL);
	DrawGraphCity(g_StatData.CITY);
	DrawGraphIndustry(g_StatData.INDUSTRY);
	DrawGraphCompany(g_StatData.COMPANY);
	DrawGraphTraffic(g_StatData.TRAFFIC);
	DrawGraphArea(g_StatData.AREA);
}

function OpenStatisticPanel(){
	var panel = $("#statisticPanel");
	panel.css("display","block");
	panel.animate({"height":"90%", "opacity":1});

	if(!g_StatData){
		$.get("/data/statistic.json", function(data){
			g_StatData = data;
			UpdateStatisticGraph();
		});
	}
	else{
		UpdateStatisticGraph();
	}
}

function CloseStatisticPanel(){
	var panel = $("#statisticPanel");
	panel.animate({"height":"0%", "opacity":0}, 400, function(){
		panel.css("display","none");
	});
}

function OpenAboutPanel(){
	var panel = $("#aboutPanel");
	panel.css("display","block");
	panel.animate({"height":"90%", "opacity":1});
}

function CloseAboutPanel(){
	var panel = $("#aboutPanel");
	panel.animate({"height":"0%", "opacity":0}, 400, function(){
		panel.css("display","none");
	});
}

function LoadInfoDetail(lat, lng){
	var source = $("#selectSource").val();
	$.get("/"+source.toLowerCase()+"-source?lat="+lat.toFixed(5)+"&lng="+lng.toFixed(5), function(data){
		OpenDetailPanel(source, data);
	});
}

function UpdatePolluteOption(){
	var source = $("#selectSource").val();
	var polluteOption = $("#selectPollute");
	var pollute = polluteOption.val();
	var show = {};
	switch(source){
		case "POINT":
			show.TSP = true;
			show.PM10 = true;
			show.PM6 = true;
			show.PM25 = true;
			show.SOX = true;
			show.NOX = true;
			show.THC = true;
			show.NMHC = true;
			show.EXHC = false;
			show.EHC = false;
			show.RHC = false;
			show.RST = false;
			show.BIO_NMHC = false;
			show.ISO = false;
			show.MONO = false;
			show.ONMHC = false;
			show.MBO = false;
			show.CO = true;
			show.PB = true;
			show.NH3 = false;
			if(show[pollute] == false){
				polluteOption.val("PM25");
			}
			break;
		case "LINE":
			show.TSP = true;
			show.PM10 = true;
			show.PM6 = true;
			show.PM25 = true;
			show.SOX = true;
			show.NOX = true;
			show.THC = true;
			show.NMHC = true;
			show.EXHC = true;
			show.EHC = true;
			show.RHC = true;
			show.RST = true;
			show.BIO_NMHC = false;
			show.ISO = false;
			show.MONO = false;
			show.ONMHC = false;
			show.MBO = false;
			show.CO = true;
			show.PB = true;
			show.NH3 = false;
			if(show[pollute] == false){
				polluteOption.val("PM25");
			}
			break;
		case "AREA":
			show.TSP = true;
			show.PM10 = true;
			show.PM6 = true;
			show.PM25 = true;
			show.SOX = true;
			show.NOX = true;
			show.THC = true;
			show.NMHC = true;
			show.EXHC = false;
			show.EHC = false;
			show.RHC = false;
			show.RST = false;
			show.BIO_NMHC = false;
			show.ISO = false;
			show.MONO = false;
			show.ONMHC = false;
			show.MBO = false;
			show.CO = true;
			show.PB = true;
			show.NH3 = false;
			if(show[pollute] == false){
				polluteOption.val("PM25");
			}
			break;
		case "BIO":
			show.TSP = false;
			show.PM10 = false;
			show.PM6 = false;
			show.PM25 = false;
			show.SOX = false;
			show.NOX = false;
			show.THC = false;
			show.NMHC = false;
			show.EXHC = false;
			show.EHC = false;
			show.RHC = false;
			show.RST = false;
			show.BIO_NMHC = true;
			show.ISO = true;
			show.MONO = true;
			show.ONMHC = true;
			show.MBO = true;
			show.CO = false;
			show.PB = false;
			show.NH3 = false;
			if(show[pollute] == false){
				polluteOption.val("BIO_NMHC");
			}
			break;
		case "NH3":
			show.TSP = false;
			show.PM10 = false;
			show.PM6 = false;
			show.PM25 = false;
			show.SOX = false;
			show.NOX = false;
			show.THC = false;
			show.NMHC = false;
			show.EXHC = false;
			show.EHC = false;
			show.RHC = false;
			show.RST = false;
			show.BIO_NMHC = false;
			show.ISO = false;
			show.MONO = false;
			show.ONMHC = false;
			show.MBO = false;
			show.CO = false;
			show.PB = false;
			show.NH3 = true;
			if(show[pollute] == false){
				polluteOption.val("NH3");
			}
			break;
		case "SUM":
			show.TSP = true;
			show.PM10 = true;
			show.PM6 = true;
			show.PM25 = true;
			show.SOX = true;
			show.NOX = true;
			show.THC = true;
			show.NMHC = true;
			show.EXHC = false;
			show.EHC = false;
			show.RHC = false;
			show.RST = false;
			show.BIO_NMHC = false;
			show.ISO = false;
			show.MONO = false;
			show.ONMHC = false;
			show.MBO = false;
			show.CO = true;
			show.PB = true;
			show.NH3 = false;
			if(show[pollute] == false){
				polluteOption.val("PM25");
			}
			break;
	}
	for(key in show){
		polluteOption.children("option[value='"+key+"']").prop('disabled', !show[key]);
	}
}

window.addEventListener('load', function() {
	$("#sensitive").change(function(){
		var value = $("#sensitive").val();
		var level = GetLevel();
		g_SenseVal[level] = value;
		$("#sensLabel").text(value);
		UpdateMapGrid();
	});

	$("#selectSource").change(function(){
		UpdatePolluteOption();
		UpdateMapGrid();
	});

	$("#selectPollute").change(function(){
		UpdateMapGrid();
	});

	$("#selPolluteTotal").change(function(){
		DrawGraphTotal(g_StatData.TOTAL);
	});

	$("#selPolluteCity").change(function(){
		DrawGraphCity(g_StatData.CITY);
	});

	$("#selPolluteIndustry").change(function(){
		DrawGraphIndustry(g_StatData.INDUSTRY);
	});

	$("#selPolluteCompany").change(function(){
		DrawGraphCompany(g_StatData.COMPANY);
	});

	$("#selPolluteTraffic").change(function(){
		DrawGraphTraffic(g_StatData.TRAFFIC);
	});

	$("#selPolluteArea").change(function(){
		DrawGraphArea(g_StatData.AREA);
	});

	LoadIDMap();
	UpdateSenseRange();
	UpdatePolluteOption();
});
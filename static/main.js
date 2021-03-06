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

function SortTable(item, index){
	var tb = $(item).parents("table");
	var rows = tb.find("tr");
	var th = $(rows[0]).children("th");
	th.removeClass("sorted");
	
	var rowData = []
	for(var i=1;i<rows.length;i++){
		var curRow = $(rows[i]);
		var curVal = parseFloat($(curRow.children("td")[index]).text());
		rowData.push({"val":curVal, "data":"<tr>"+curRow.html()+"</tr>"});
		curRow.remove();
	}
	function CompareFunc(a,b){
		return b.val - a.val;
	}
	rowData.sort(CompareFunc);
	for(var i=0;i<rowData.length;i++){
		var sortData = rowData[i].data;
		tb.append($(sortData));
	}

	/*var isSwitch = true;
	while(isSwitch){
		isSwitch = false;
		for(var i=1;i<rows.length-1;i++){
			var curRow = $(rows[i]);
			var nextRow = $(rows[i+1]);
			var curVal = parseFloat($(curRow.children("td")[index]).text());
			var nextVal = parseFloat($(nextRow.children("td")[index]).text());
			if(curVal < nextVal){
				var html = curRow.html();
				curRow.html(nextRow.html());
				nextRow.html(html);
				isSwitch = true;
				break;
			}
		}
	}*/
	$(th[index]).addClass("sorted");
}

function GenPointTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<th>公司名稱</th>";
	str += "<th>汙染源編號</th>";
	str += "<th class='clickable' onclick='SortTable(this,2);'>TSP<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,3);'>PM10<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,4);'>PM6<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,5);'>PM2.5<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,6);'>SOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,7);'>NOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,8);'>THC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,9);'>NMHC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,10);'>CO<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,11);'>PB<br>(公噸/年)</th>";
	str += "<th>粒狀物控制效率<br>(%)</th>";
	str += "<th>SOx控制效率<br>(%)</th>";
	str += "<th>NOx控制效率<br>(%)</th>";
	str += "<th>THC控制效率<br>(%)</th>";
	str += "<th>CO控制效率<br>(%)</th>";
	str += "<th>PB控制效率<br>(%)</th>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.TSP_EMI == 0 && d.PM_EMI == 0 && d.PM6_EMI == 0 && d.PM25_EMI == 0 &&
			d.SOX_EMI == 0 && d.NOX_EMI == 0 && d.THC_EMI == 0 && d.NMHC_EMI == 0 &&
			d.CO_EMI == 0 && d.PB_EMI == 0) continue;
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
	str += "<th class='clickable' onclick='SortTable(this,2);'>TSP<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,3);'>PM10<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,4);'>PM6<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,5);'>PM2.5<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,6);'>SOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,7);'>NOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,8);'>THC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,9);'>NMHC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,10);'>HC尾氣排放<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,11);'>HC蒸發損失<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,12);'>HC行駛損失<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,13);'>HC停等損失<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,14);'>CO<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,15);'>PB<br>(公噸/年)</th>";
	str += "</tr>";

	var road = {};
	road["1"] = "國道";
	road["2"] = "省道";
	road["3"] = "縣道";
	road["4"] = "市/鄉道";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.EM_TSP == 0 && d.EM_PM == 0 && d.EM_PM6 == 0 && d.EM_PM25 == 0 &&
			d.EM_SOX == 0 && d.EM_NOX == 0 && d.EM_THC == 0 && d.EM_NMHC == 0 &&
			d.EM_EXHC == 0 && d.EM_EHC == 0 && d.EM_RHC == 0 && d.EM_RST == 0 &&
			d.EM_CO == 0 && d.EM_PB == 0) continue;
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
	str += "<th class='clickable' onclick='SortTable(this,1);'>TSP<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,2);'>PM10<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,3);'>PM6<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,4);'>PM2.5<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,5);'>SOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,6);'>NOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,7);'>THC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,8);'>NMHC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,9);'>CO<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,10);'>PB<br>(公噸/年)</th>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.EM_TSP == 0 && d.EM_PM == 0 && d.EM_PM6 == 0 && d.EM_PM25 == 0 &&
			d.EM_SOX == 0 && d.EM_NOX == 0 && d.EM_THC == 0 && d.EM_NMHC == 0 &&
			d.EM_CO == 0 && d.EM_PB == 0) continue;
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
	str += "<th class='clickable' onclick='SortTable(this,0);'>總非甲烷碳氫有機氣體<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,1);'>異戊二烯(Isoprene)<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,2);'>單帖類(Monoterpenes)<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,3);'>其他非甲烷碳氫有機氣體<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,4);'>甲基-丁烯-醇(Methyl-Buten-Ol)<br>(公噸/年)</th>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.TOTAL_NMHC == 0 && d.ISO == 0 && d.MONO == 0 && d.ONMHC == 0 &&
			d.MBO == 0) continue;
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
	str += "<th class='clickable' onclick='SortTable(this,1);'>NH3<br>(公噸/年)</th>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.EM_NH3 == 0) continue;
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
	str += "<th class='clickable' onclick='SortTable(this,1);'>TSP<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,2);'>PM10<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,3);'>PM6<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,4);'>PM2.5<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,5);'>SOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,6);'>NOx<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,7);'>THC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,8);'>NMHC<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,9);'>CO<br>(公噸/年)</th>";
	str += "<th class='clickable' onclick='SortTable(this,10);'>PB<br>(公噸/年)</th>";
	str += "</tr>";
	var type = {};
	type.POINT = "點源";
	type.LINE = "線源";
	type.AREA = "面源";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		//skip沒有排放的資料
		if(d.TSP == 0 && d.PM == 0 && d.PM6 == 0 && d.PM25 == 0 &&
			d.SOX == 0 && d.NOX == 0 && d.THC == 0 && d.NMHC == 0 &&
			d.CO == 0 && d.PB == 0) continue;
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
	DrawGraphDict(g_StatData.CITY);
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

	$("#selPolluteDict").change(function(){
		DrawGraphDict(g_StatData.CITY);
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

	$("#statisticPanel").scroll(function(){
		var panel = $(this);
		var top = parseInt(panel.scrollTop());
		panel.children(".close-bt").css("top",10+top);
	});

	LoadIDMap();
	UpdateSenseRange();
	UpdatePolluteOption();
});
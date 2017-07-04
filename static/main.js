var g_AreaType = {};
var g_NH3Type = {};


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

function LoadAreaType(){
	$.get("/data/area_type.csv", function(d){
		g_AreaType = {};
		var arr = d.split("\n");
		for(var i=0;i<arr.length;i++){
			var line = arr[i];
			var row = line.split(",");
			g_AreaType[row[0]] = row[1];
		}
	});
	$.get("/data/nh3_type.csv", function(d){
		g_NH3Type = {};
		var arr = d.split("\n");
		for(var i=0;i<arr.length;i++){
			var line = arr[i];
			var row = line.split(",");
			g_NH3Type[row[0]] = row[1];
		}
	});
	
}

function GenPointTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<td>公司名稱</td>";
	str += "<td>汙染源編號</td>";
	str += "<td>TSP<br>(公噸/年)</td>";
	str += "<td>PM10<br>(公噸/年)</td>";
	str += "<td>PM6<br>(公噸/年)</td>";
	str += "<td>PM2.5<br>(公噸/年)</td>";
	str += "<td>SOx<br>(公噸/年)</td>";
	str += "<td>NOx<br>(公噸/年)</td>";
	str += "<td>THC<br>(公噸/年)</td>";
	str += "<td>NMHC<br>(公噸/年)</td>";
	str += "<td>CO<br>(公噸/年)</td>";
	str += "<td>PB<br>(公噸/年)</td>";
	str += "<td>粒狀物控制效率<br>(%)</td>";
	str += "<td>SOx控制效率<br>(%)</td>";
	str += "<td>NOx控制效率<br>(%)</td>";
	str += "<td>THC控制效率<br>(%)</td>";
	str += "<td>CO控制效率<br>(%)</td>";
	str += "<td>PB控制效率<br>(%)</td>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td>"+d.COMP_NAM+"</td>";
		str += "<td>"+d.NO_P+"</td>";
		str += "<td>"+d.TSP_EMI+"</td>";
		str += "<td>"+d.PM_EMI+"</td>";
		str += "<td>"+d.PM6_EMI+"</td>";
		str += "<td>"+d.PM25_EMI+"</td>";
		str += "<td>"+d.SOX_EMI+"</td>";
		str += "<td>"+d.NOX_EMI+"</td>";
		str += "<td>"+d.THC_EMI+"</td>";
		str += "<td>"+d.NMHC_EMI+"</td>";
		str += "<td>"+d.CO_EMI+"</td>";
		str += "<td>"+d.PB_EMI+"</td>";
		str += "<td>"+d.TSP_EFF+"</td>";
		str += "<td>"+d.SOX_EFF+"</td>";
		str += "<td>"+d.NOX_EFF+"</td>";
		str += "<td>"+d.THC_EFF+"</td>";
		str += "<td>"+d.CO_EFF+"</td>";
		str += "<td>"+d.PB_EFF+"</td>";
	}
	str += "</table>";
	return str;
}

function GenLineTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<td>車種別</td>";
	str += "<td>道路別</td>";
	str += "<td>TSP<br>(公噸/年)</td>";
	str += "<td>PM10<br>(公噸/年)</td>";
	str += "<td>PM6<br>(公噸/年)</td>";
	str += "<td>PM2.5<br>(公噸/年)</td>";
	str += "<td>SOx<br>(公噸/年)</td>";
	str += "<td>NOx<br>(公噸/年)</td>";
	str += "<td>THC<br>(公噸/年)</td>";
	str += "<td>NMHC<br>(公噸/年)</td>";
	str += "<td>HC尾氣排放<br>(公噸/年)</td>";
	str += "<td>HC蒸發損失<br>(公噸/年)</td>";
	str += "<td>HC行駛損失<br>(公噸/年)</td>";
	str += "<td>HC停等損失<br>(公噸/年)</td>";
	str += "<td>CO<br>(公噸/年)</td>";
	str += "<td>PB<br>(公噸/年)</td>";
	str += "</tr>";

	var nsc = {};
	nsc.pldgv = "自用小客車-汽油";
	nsc.plddv = "自用小客車-柴油";
	nsc.bldgv = "計程車";
	nsc.bldlpg = "LPG小客車";
	nsc.ldgt = "汽油小貨車";
	nsc.lddt = "柴油小貨車";
	nsc.hdgv = "柴油大客車";
	nsc.hddt = "柴油大貨車";
	nsc.bus = "公車/客運車";
	nsc.mc2 = "二行程機車";
	nsc.mc4 = "四行程機車";
	nsc.ldsv = "輕型特種車";
	nsc.hdsv = "重型特種車";
	var road = {};
	road["1"] = "國道";
	road["2"] = "省道";
	road["3"] = "縣道";
	road["4"] = "市/鄉道";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td>"+nsc[d.NSC.toLowerCase()]+"</td>";
		str += "<td>"+road[d.NSC_SUB]+"</td>";
		str += "<td>"+d.EM_TSP+"</td>";
		str += "<td>"+d.EM_PM+"</td>";
		str += "<td>"+d.EM_PM6+"</td>";
		str += "<td>"+d.EM_PM25+"</td>";
		str += "<td>"+d.EM_SOX+"</td>";
		str += "<td>"+d.EM_NOX+"</td>";
		str += "<td>"+d.EM_THC+"</td>";
		str += "<td>"+d.EM_NMHC+"</td>";
		str += "<td>"+d.EM_EXHC+"</td>";
		str += "<td>"+d.EM_EHC+"</td>";
		str += "<td>"+d.EM_RHC+"</td>";
		str += "<td>"+d.EM_RST+"</td>";
		str += "<td>"+d.EM_CO+"</td>";
		str += "<td>"+d.EM_PB+"</td>";
	}
	str += "</table>";
	return str;
}

function GenAreaTable(data){
	var str = "<table>";
	str += "<tr>";
	str +="<td>面源種類</td>";
	str += "<td>TSP<br>(公噸/年)</td>";
	str += "<td>PM10<br>(公噸/年)</td>";
	str += "<td>PM6<br>(公噸/年)</td>";
	str += "<td>PM2.5<br>(公噸/年)</td>";
	str += "<td>SOx<br>(公噸/年)</td>";
	str += "<td>NOx<br>(公噸/年)</td>";
	str += "<td>THC<br>(公噸/年)</td>";
	str += "<td>NMHC<br>(公噸/年)</td>";
	str += "<td>CO<br>(公噸/年)</td>";
	str += "<td>PB<br>(公噸/年)</td>";
	str += "</tr>";

	for(var i=0;i<data.length;i++){
		var d = data[i];
		var type = d.NSC;
		if(d.NSC_SUB) type += d.NSC_SUB;
		str += "<tr>";
		str += "<td>"+(g_AreaType[type]?g_AreaType[type]:type)+"</td>";
		str += "<td>"+d.EM_TSP+"</td>";
		str += "<td>"+d.EM_PM+"</td>";
		str += "<td>"+d.EM_PM6+"</td>";
		str += "<td>"+d.EM_PM25+"</td>";
		str += "<td>"+d.EM_SOX+"</td>";
		str += "<td>"+d.EM_NOX+"</td>";
		str += "<td>"+d.EM_THC+"</td>";
		str += "<td>"+d.EM_NMHC+"</td>";
		str += "<td>"+d.EM_CO+"</td>";
		str += "<td>"+d.EM_PB+"</td>";
	}
	str += "</table>";
	return str;
}

function GenBioTable(data){
	var str = "<table>";
	str += "<tr>";
	str += "<td>總非甲烷碳氫有機氣體<br>(公噸/年)</td>";
	str += "<td>異戊二烯(Isoprene)<br>(公噸/年)</td>";
	str += "<td>單帖類(Monoterpenes)<br>(公噸/年)</td>";
	str += "<td>其他非甲烷碳氫有機氣體<br>(公噸/年)</td>";
	str += "<td>甲基-丁烯-醇(Methyl-Buten-Ol)<br>(公噸/年)</td>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td>"+d.TOTAL_NMHC+"</td>";
		str += "<td>"+d.ISO+"</td>";
		str += "<td>"+d.MONO+"</td>";
		str += "<td>"+d.ONMHC+"</td>";
		str += "<td>"+d.MBO+"</td>";
	}
	str += "</table>";
	return str;
}

function GenNH3Table(data){
	var str = "<table>";
	str += "<tr>";
	str += "<td>氨源種類</td>";
	str += "<td>NH3<br>(公噸/年)</td>";
	str += "</tr>";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td>"+(g_NH3Type[d.NSC]?g_NH3Type[d.NSC]:d.NSC)+"</td>";
		str += "<td>"+d.EM_NH3+"</td>";
	}
	str += "</table>";
	return str;
}

function GenSumTable(data){
	var str = "<table>";
	str += "<tr>";
	str += "<td>汙染源</td>";
	str += "<td>TSP<br>(公噸/年)</td>";
	str += "<td>PM10<br>(公噸/年)</td>";
	str += "<td>PM6<br>(公噸/年)</td>";
	str += "<td>PM2.5<br>(公噸/年)</td>";
	str += "<td>SOx<br>(公噸/年)</td>";
	str += "<td>NOx<br>(公噸/年)</td>";
	str += "<td>THC<br>(公噸/年)</td>";
	str += "<td>NMHC<br>(公噸/年)</td>";
	str += "<td>CO<br>(公噸/年)</td>";
	str += "<td>PB<br>(公噸/年)</td>";
	str += "</tr>";
	var type = {};
	type.POINT = "點源";
	type.LINE = "線源";
	type.AREA = "面源";
	for(var i=0;i<data.length;i++){
		var d = data[i];
		str += "<tr>";
		str += "<td>"+type[d.TYPE]+"</td>";
		str += "<td>"+d.TSP+"</td>";
		str += "<td>"+d.PM+"</td>";
		str += "<td>"+d.PM6+"</td>";
		str += "<td>"+d.PM25+"</td>";
		str += "<td>"+d.SOX+"</td>";
		str += "<td>"+d.NOX+"</td>";
		str += "<td>"+d.THC+"</td>";
		str += "<td>"+d.NMHC+"</td>";
		str += "<td>"+d.CO+"</td>";
		str += "<td>"+d.PB+"</td>";
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

function OpenStatisticPanel(){
	var panel = $("#statisticPanel");
	panel.css("display","block");
	panel.animate({"height":"90%", "opacity":1});
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

	LoadAreaType();
	UpdateSenseRange();
	UpdatePolluteOption();
});
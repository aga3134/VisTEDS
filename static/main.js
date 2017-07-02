
function OpenControlPanel(){
	$("#controlPanel").css("left",0);
}

function CloseControlPanel(){
	$("#controlPanel").css("left",-500);	
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
		case "ALL":
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

	UpdateSenseRange();
	UpdatePolluteOption();
});
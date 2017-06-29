
function OpenControlPanel(){
	$("#controlPanel").css("left",0);
}

function CloseControlPanel(){
	$("#controlPanel").css("left",-500);	
}

window.addEventListener('load', function() {
	$("#sensitive").change(function(){
		var value = $("#sensitive").val();
		$("#sensLabel").text(value);
		UpdateMapGrid();
	});

	$("#selectSource").change(function(){
		UpdateMapGrid();
	});

	$("#selectPollute").change(function(){
		UpdateMapGrid();
	});

});
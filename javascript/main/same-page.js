$(document).ready(function(){

	var $newUserBtn = $("#new-user-button");

	$("#new-user-button").click(function(){
		$('#test').show();
		$('#testTwo').hide();
	});

	$("#return-user-button").click(function(){
		$('#testTwo').show();
		$('#test').hide();
	});






// ====================== END OF DOC.READY	======================
});
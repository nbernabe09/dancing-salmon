var navIsOpen = false;

// Functions
function openNav() {
  $("#mySidenav").css("width", "30%");
  $("#main").css("marginLeft", "30%");
  $("#leftTab").css("left", "30%");
  $(".navbar").css("marginLeft", "30%");
  navIsOpen=!navIsOpen;
}

function closeNav() {
  $("#mySidenav").css("width", "0");
  $("#main").css("marginLeft", "0");
  $("#leftTab").css("left", "0");
  $(".navbar").css("marginLeft", "0");
  navIsOpen=!navIsOpen;
}

// Buttons
$("#burger").on("click", function() {
	if (navIsOpen) {
		closeNav();
	} else {
		openNav();
	}
});

$("#openLeftDash").on("click", function() {
	if (navIsOpen) {
		closeNav();
	} else {
		openNav();
	}
});
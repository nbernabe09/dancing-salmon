var leftNavIsOpen = false;

// Functions
function openLeftNav() {
  $("#leftNav").css("width", "30%");
  $("#main").css("marginLeft", "30%");
  $("#leftTab").css("left", "30%");
  $(".navbar").css("marginLeft", "30%");
  leftNavIsOpen=!leftNavIsOpen;
}

function closeLeftNav() {
  $("#leftNav").css("width", "0");
  $("#main").css("marginLeft", "0");
  $("#leftTab").css("left", "0");
  $(".navbar").css("marginLeft", "0");
  leftNavIsOpen=!leftNavIsOpen;
}

// Buttons
// $("#burger").on("click", function() {
// 	if (navIsOpen) {
// 		closeNav();
// 	} else {
// 		openNav();
// 	}
// });

$("#leftTab").on("click", function() {
	if (leftNavIsOpen) {
		closeLeftNav();
	} else {
		openLeftNav();
	}
});
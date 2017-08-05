var navIsOpen = false;

// Functions
function openNav() {
    document.getElementById("mySidenav").style.width = "30%";
    document.getElementById("main").style.marginLeft = "30%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

// Buttons

$("#burger").on("click", function() {
	if (navIsOpen) {
		closeNav();
	} else {
		openNav();
	}
	navIsOpen=!navIsOpen
});
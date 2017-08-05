var navIsOpen = false;

// Functions
function openNav() {
    document.getElementById("mySidenav").style.width = "20%";
    document.getElementById("main").style.marginLeft = "20%";
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
var playing = false;

$("#musicPlay").on("click", function() {
	if (playing) {
		$("#play-btn").attr("class", "glyphicon glyphicon-play")
	} else {
		$("#play-btn").attr("class", "glyphicon glyphicon-pause")
	}
	playing = !playing;
})

$("#music-controls").submit(function() {
	event.preventDefault();
})

$("#searchBox").on("input", function() {
    var searchText = $("#searchBox").val();
    if (searchText === "") {
        $("#search-results").css("visibility", "hidden");
    } else {
        event.preventDefault();
        $("#search-results").css("visibility", "visible");
        $("#search-results").text(searchText);
    }
})
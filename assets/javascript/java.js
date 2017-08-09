var playing = false;

$("#play-btn").on("click", function() {
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
	event.preventDefault();
	console.log($("#searchBox").val());
	
})
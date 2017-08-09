// Global Variables
  var playing = false;
  var debouncedAjax = _.debounce(doAjax, 400);

// Functions
  function doAjax(){
    $("#search-results").empty();
    var songArray = [];
    var song = $("#searchBox").val();
    var queryURL = 'https://api.discogs.com/database/search?q='+song+'&key=JOwiPIVkZGKqzPMffeLo&secret=TTdaxTVwWBjataauUqtEjCGckNrSOmtk';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      var noDuplicates = _.uniqBy(response.results, function(list) { return list.title; });
      var numItems = 10;
      if(noDuplicates.length < numItems) {
          numItems = noDuplicates.length;
      }
      for(var i=0; i<numItems; i++) {
          displaySearch(noDuplicates[i].thumb, noDuplicates[i].title)
      }
    });
  }

  function displaySearch(pic, title) {
    var newDiv = $("<div>");
    var leftDiv = $("<div>");
    var rightDiv = $("<div>");
    var newImg = $("<img>");
    newDiv.addClass("row search-line");
    leftDiv.addClass("tester col-xs-3");
    rightDiv.addClass("col-xs-9");
    newImg.addClass("search-image")
    console.log(pic || "dne")
    newImg.attr("src", pic || "assets/images/empty.jpg");
    leftDiv.append(newImg);
    rightDiv.text(title);
    newDiv.append(leftDiv);
    newDiv.append(rightDiv);
    $("#search-results").append(newDiv);    
  }

// Buttons
  $("#musicPlay").on("click", function() {
  	if (playing) {
  		$("#play-btn").attr("class", "glyphicon glyphicon-play")
  	} else {
  		$("#play-btn").attr("class", "glyphicon glyphicon-pause")
  	}
  	playing = !playing;
  });

  $("#music-search").submit(function() {
  	event.preventDefault();
  });

  $("#searchBox").on("input", function() {
    event.preventDefault();
    var searchText = $("#searchBox").val();
    if (searchText === "") {
      $("#search-results").css("visibility", "hidden");
    } else {
      event.preventDefault();
      $("#search-results").css("visibility", "visible");
      debouncedAjax();
    }
  });
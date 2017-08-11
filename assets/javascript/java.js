// Global Variables
  var playing = false;
  var debouncedAjax = _.debounce(doAjax, 400);
  var resultsHidden = true;
  var currentArtist = "";
  var discogsCall = new DiscogsAPIUtil();

// Functions
  function showResults() {
    $("#search-results").css("visibility", "visible");
    resultsHidden = false;
  }

    function hideResults() {
    $("#search-results").css("visibility", "hidden");
    resultsHidden = true;
  }

  function doAjax() {
    $("#search-results").empty();
    var songArray = [];
    var song = $("#searchBox").val();
    discogsCall.queryAPI(song).then((resp) => {
    	var sr = discogsCall.newSR(resp.results);
    	var tmpId = sr.release[0].id;
    	discogsCall.releaseAPI(tmpId).then(function(res) {
    		console.log("%%%");
    		console.log(res.videos[0].uri);
    		console.log("%%%");
    	})
    	sr.release.forEach(function(elem){
    		displayArtist(elem.thumb, elem.title)
    	})
    	/*var noDuplicates = _.uniqBy(sr.artist, function(list) { return list.title; });/
      var numItems = 10;
      if(noDuplicates.length < numItems) {
          numItems = noDuplicates.length;
      }
      for(var i=0; i<numItems; i++) {
          displaySearch(noDuplicates[i].thumb, noDuplicates[i].title)
      }*/
    });
    
    /*var queryURL = 'https://api.discogs.com/database/search?q='+song+'&key=JOwiPIVkZGKqzPMffeLo&secret=TTdaxTVwWBjataauUqtEjCGckNrSOmtk';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      
    });*/
  }

  function displaySearch(pic, title, type, id) {
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

  function displayArtist(pic, title, id) {
  	displaySearch(pic, title, "artist", id);
  }

// Buttons
  $("#musicBack").on("click", function() {
    alert("This button goes back one song (if possible)")
  });

  $("#musicPlay").on("click", function() {
  	if (playing) {
  		$("#play-btn").attr("class", "glyphicon glyphicon-play")
  	} else {
  		$("#play-btn").attr("class", "glyphicon glyphicon-pause")
  	}
  	playing = !playing;
  });

  $("#musicStop").on("click", function() {
    $("#play-btn").attr("class", "glyphicon glyphicon-play")
    playing = false;
  });

  $("#musicSkip").on("click", function() {
    alert("This button skips to the next song")
  });

  $("#music-search").submit(function() {
  	event.preventDefault();
  });

  $("#searchBox").on("input", function() {
    event.preventDefault();
    var searchText = $("#searchBox").val();
    if (searchText === "") {
      resultsHidden = true;
      $("#search-results").css("visibility", "hidden");
    } else {
      event.preventDefault();
      resultsHidden = false;
      $("#search-results").css("visibility", "visible");
      debouncedAjax();
    }
  });

  $("#search").on("click", function () {
    if (resultsHidden) {
      showResults();
    } else {
      hideResults();
    }
  });
  
 	$("#upcoming-concerts").on("click", function() {
	 	$("#home-page").hide();
	 	$("#upcoming-concerts-display").show();
	 	$("#upcoming-concerts-display").html("<h1>" + currentArtist + "</h1>");
	  $("#artistPage").css("width", "0");
 		console.log(currentArtist);
 		var bandsInTown = new BitAPI();
 		bandsInTown.searchAPI(currentArtist).then((bitData)=>{
 				bitData.forEach((elem)=>{
 					var newDiv = $("<div>")
 					newDiv.append(elem.id);
 					newDiv.append("<br>");
 					newDiv.append(elem.date);
 					newDiv.append("<br>");
 					newDiv.append(elem.city);
 					newDiv.append("<br>");
 					newDiv.append(elem.venue);
 					newDiv.append("<br>");
 					newDiv.append("<a href ='" + elem.ticketURL + "'>Buy Tickets</a>");
 					$("#upcoming-concerts-display").append(newDiv)
 				});
 		})
 	})
 	
 	$("#boomboom").on("click", function() {
 		currentArtist = $(this).attr("value");
 	});
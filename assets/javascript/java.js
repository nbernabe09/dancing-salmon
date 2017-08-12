// Global Variables
  var leftNavIsOpen = false;
  var rightNavIsOpen = false;
  var playing = false;
  var debouncedAjax = _.debounce(doAjax, 400);
  var resultsHidden = true;
  var currentArtist = "";
  var currentStation = "";
  var discogsCall = new DiscogsAPIUtil();

// Functions
  function openLeftNav() {
    $("#leftNav").css("width", "20%");
    // $("#leftNav").css("min-width", "193px");
    $(".main").css("marginLeft", "20%");
    $("#leftTab").css("left", "20%");
    $("#navbar").css("marginLeft", "20%");
    leftNavIsOpen = !leftNavIsOpen;
  }

  function closeLeftNav() {
    $("#leftNav").css("width", "0");
    // $("#leftNav").css("min-width", "0");
    $(".main").css("marginLeft", "0");
    $("#leftTab").css("left", "0");
    $("#navbar").css("marginLeft", "0");
    leftNavIsOpen = !leftNavIsOpen;
  }

  function openRightNav() {
    $("#rightNav").css("width", "20%");
    $("#rightTab").css("right", "20%");
    $("#bottomNav").css("width", "80%");
    rightNavIsOpen = !rightNavIsOpen;
  }

  function closeRightNav() {
    $("#rightNav").css("width", "0");
    $("#rightTab").css("right", "0");
    $("#bottomNav").css("width", "100%");
    rightNavIsOpen = !rightNavIsOpen;
  }

  function openArtNav() {
    $("#artistPage").show(500);
  }

  function closeArtNav() {
    $("#artistPage").hide(500);
  }

  function showResults() {
    $("#search-results").css("visibility", "visible");
    resultsHidden = false;
  }

  function hideResults() {
    $("#search-results").css("visibility", "hidden");
    resultsHidden = true;
  }

  $(document).on('click', function() {
    if (!resultsHidden) {
      hideResults();
    }
  });

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
      sr.release.forEach(function(elem) {
        displayArtist(elem.thumb, elem.title, elem.id);
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
    var newDiv        =     $("<div>");
    var leftDiv       =     $("<div>");
    var rightDiv      =     $("<div>");
    var newImg        =     $("<img>");

    function displaySearch(pic, title, type, id) {
      var newDiv = $("<div>");
      var leftDiv = $("<div>");
      var rightDiv = $("<div>");
      var newImg = $("<img>");
      newDiv.addClass("row search-line");
      leftDiv.addClass("tester col-xs-3");
      rightDiv.addClass("col-xs-9");
      newImg.addClass("search-image")
      //console.log(pic || "dne")
      newImg.attr("src", pic || "assets/images/empty.jpg");
      newDiv.attr('id',id);
      leftDiv.append(newImg);
      rightDiv.text(title);
      newDiv.append(leftDiv);
      newDiv.append(rightDiv);
      $("#search-results").append(newDiv);
    }


    newDiv.addClass("row search-line");
    leftDiv.addClass("tester col-xs-3");
    rightDiv.addClass("col-xs-9");
    newImg.addClass("search-image")
    console.log(pic || "dne")
    newDiv.attr('id', id);
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

  function clearSearchResults(){
    $('#searchBox').val('');
    $('#search-results').empty();
    hideResults();
  }

  function hasChildren(element){
    return (element.children().length == 0) ? false : true;
  }

// Buttons
  $("#rightTab").on("click", function() {
    if (rightNavIsOpen) {
      closeRightNav();
    } else {
      openRightNav();
    }
  });

  $("#leftTab").on("click", function() {
    if (leftNavIsOpen) {
      closeLeftNav();
    } else {
      openLeftNav();
    }
  });

  $(".artist").on("click", openArtNav);

  $("#closeArtist").on("click", closeArtNav);

  // $("#musicBack").on("click", function() {
  //   alert("This button goes back one song (if possible)")
  // });

  $("#musicPlay").on("click", function() {
    if ($("#radio").attr("src") === "") {
      alert("Use the right tab to load a radio station!");
    } else {
      if (playing) {
        $("#radio")[0].pause();
        $("#play-btn").attr("class", "glyphicon glyphicon-play")
      } else {
        $("#radio")[0].play();
        $("#play-btn").attr("class", "glyphicon glyphicon-pause")
      }
      playing = !playing;
    }

  });

  $("#musicStop").on("click", function() {
    $("#radio").attr("src", "");
    $("#currentStation").text("");
    $("#play-btn").attr("class", "glyphicon glyphicon-play");
    $("#radio")[0].pause();
    playing = false;
  });

  // $("#musicSkip").on("click", function() {
  //   alert("This button skips to the next song")
  // });

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

  // Search Icon Function
  $("#search").on("click", function() {
    var isHidden = resultsHidden;
    if (hasChildren($('#search-results'))){
      setTimeout(function(){
        if (isHidden){
          $('#search-results').css('visibility','visible');
          resultsHidden = false;
        }
      },100);
    }
  });

  $("#upcoming-concerts").on("click", function() {
    $("#home-page").hide();
    $("#upcoming-concerts-display").show();
    $("#upcoming-concerts-display").html("<h1>" + currentArtist + "</h1>");
    closeArtNav();
    console.log(currentArtist);
    var bandsInTown = new BitAPI();
    bandsInTown.searchAPI(currentArtist).then((bitData) => {
      bitData.forEach((elem) => {
        var newDiv = $("<div>");
        newDiv.addClass("concertInfo col-md-4 col-sm-6");
        newDiv.append(moment(elem.date).format("ddd MMMM D, YYYY - h:mm A"));
        newDiv.append("<br>");
        newDiv.append(elem.venue);
        newDiv.append("<br>");
        newDiv.append(elem.city + ", " + elem.region);
        newDiv.append("<br>");
        newDiv.append("<a target='_blank' href ='" + elem.ticketURL + "'>Buy Tickets</a>");
        $("#upcoming-concerts-display").append(newDiv)
      });
    })
  })

  $("#boomboom").on("click", function() {
    currentArtist = $(this).attr("value");
  });

  $("#homeBtn").on("click", function() {
    $("#upcoming-concerts-display").empty();
    $("#upcoming-concerts-display").hide();
    $("#home-page").show();
  })

  $(".station").on("click", function() {
    currentStation = $(this).attr("value");
    $("#currentStation").text($(this).attr("station"));
    $("#radio").attr("src", currentStation);
    $("#radio")[0].play();
    $("#play-btn").attr("class", "glyphicon glyphicon-pause")
    playing = true;
  });

  // Adds youtube video to main screen
  $('#search-results').on('click', '.search-line', function() {
    var id = $(this).attr('id');
    $('#mainScreen').addClass("videoWrapper");
    discogsCall.releaseAPI(id).then(function(res) {
      var mainScreen   =   $('#mainScreen');
      var baseURL      =   'https://www.youtube.com/embed/'
      var youtubeURL   =   res.videos[0].uri.slice(32);
      var iframe       =   $('<iframe>');

      iframe.attr('src', baseURL + youtubeURL);
      iframe.attr('frameborder', 0);
      iframe.attr('allowfullscreen');
      mainScreen.html(iframe);
      clearSearchResults();
    })
  });

  $(".station").on("click", function() {
    currentStation = $(this).attr("value");
    $("#currentStation").text($(this).attr("station"));
    $("#radio").attr("src", currentStation);
    $("#radio")[0].play();
    $("#play-btn").attr("class", "glyphicon glyphicon-pause")
    playing = true;
  });

  $(document).on('click', function() {
    if (!resultsHidden) {
      hideResults();
    }
  });

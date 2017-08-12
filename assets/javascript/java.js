// Global Variables
  var leftNavIsOpen = false;
  var rightNavIsOpen = false;
  var playing = false;
  var debouncedAjax = _.debounce(doAjax, 400);
  var resultsHidden = true;
  var currentArtist = "";
  var currentStation = "";
  var discogsCall = new DiscogsAPIUtil();

  $("#mainScreen").hide();

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
     
      $("#search-results").append("<p>Artists</p>");
      var noDuplicatesArtist = _.uniqBy(sr.artist, function(list) { return list.title; });
      noDuplicatesArtist.forEach(function(elem) {
        displaySearch(elem.thumb, elem.title, "artist", elem.id)
        /*console.log(elem);*/
      })

      $("#search-results").append("<hr><p>Releases</p>");

      var noDuplicatesRelease = _.uniqBy(sr.release, function(list) { return list.title; });
      noDuplicatesRelease.forEach(function(elem) {
        displaySearch(elem.thumb, elem.title, "release", elem.id)
      })
    });

    var queryURL = 'https://api.discogs.com/database/search?q=eminem&key=JOwiPIVkZGKqzPMffeLo&secret=TTdaxTVwWBjataauUqtEjCGckNrSOmtk';
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      /*console.log(response)*/
    });
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
      leftDiv.addClass("search-image-holder col-xs-3");
      rightDiv.addClass("col-xs-9");
      newImg.addClass("search-image")
      //console.log(pic || "dne")
      newImg.attr("src", pic || "assets/images/empty.jpg");
      newDiv.attr('id',id);
      newDiv.attr('type', type)
      leftDiv.append(newImg);
      rightDiv.text(title);
      newDiv.append(leftDiv);
      newDiv.append(rightDiv);
      $("#search-results").append(newDiv);
    }


    newDiv.addClass("row search-line");
    leftDiv.addClass("search-image-holder col-xs-3");
    rightDiv.addClass("col-xs-9");
    newImg.addClass("search-image")
    /*console.log(pic || "dne")*/
    newDiv.attr('id', id);
    newDiv.attr('type', type);
    newDiv.attr('title', title);
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

  $("#boomboom").on("click", function() {
    currentArtist = $(this).attr("value");
  });

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
    var currentArtist = $(this).attr("title");
    var id = $(this).attr('id');
    var type = $(this).attr("type");

    if (type === "artist") {
      $("#artistPage").show(500);

      $("#about-artist").empty();
      discogsCall.artistAPI(id).then((resp) => {
        $("#about-artist").append(resp.profile);
      })

      // var queryURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + currentArtist + '&format=json&callback=?';
      // $.ajax({
      //   url: queryURL,
      //   type: "GET",
      //   contentType: "application/json; charset=utf-8",
      //   async: false,
      //   dataType: "json",
      //   method: "GET"
      // }).done(function(response) {
      //   $("#about-artist").append(response[2][0]);
      // });
  
      $("#top-songs").empty();
      discogsCall.queryAPI(currentArtist).then((resp) => {
        var sr = discogsCall.newSR(resp.results);

        var noDuplicatesRelease = _.uniqBy(sr.release, function(list) { return list.title; });
        noDuplicatesRelease.forEach(function(elem, index) {
          $("#top-songs").append("<p>" + (index + 1) + ". " + elem.title + "</p>");
        });
      });

      $("#upcoming-concerts").empty();
      var bandsInTown = new BitAPI();
      bandsInTown.searchAPI(currentArtist).then((bitData) => {
        bitData.forEach((elem) => {
          var newDiv = $("<div>");
          newDiv.addClass("concert-info col-md-4 col-sm-6");
          newDiv.append(moment(elem.date).format("ddd MMMM D, YYYY - h:mm A"));
          newDiv.append("<br>");
          newDiv.append(elem.venue);
          newDiv.append("<br>");
          newDiv.append(elem.city + ", " + elem.region);
          newDiv.append("<br>");
          newDiv.append("<a target='_blank' href ='" + elem.ticketURL + "'>Buy Tickets</a>");
          $("#upcoming-concerts").append(newDiv)
        });
      })

  


    } else if (type === "release") {
      $('#mainScreen').addClass("videoWrapper");
      discogsCall.releaseAPI(id).then(function(res) {
        var mainScreen   =   $('#mainScreen');
        var baseURL      =   'https://www.youtube.com/embed/'
        var youtubeURL   =   res.videos[0].uri.slice(32) + "?autoplay=1";
        var iframe       =   $('<iframe>');

        iframe.attr('src', baseURL + youtubeURL);
        iframe.attr('frameborder', '0');
        iframe.attr('width', '560');
        iframe.attr('height', '315');
        iframe.attr('allowfullscreen');
        mainScreen.html(iframe);
        clearSearchResults();
          $("#mainScreen").slideDown(250);
        
      })
    }
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

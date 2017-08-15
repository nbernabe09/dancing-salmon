// Global Variables
var leftNavIsOpen = false;
var rightNavIsOpen = false;
var playing = false;
var resultsHidden = true;
var title = "";
var currentStation = "";
var discogsCall = new DiscogsAPIUtil();
var netRadio    = new NetRadio();
var bandsInTown = new BitAPI();
var giphyApi    = new GiphyGif();

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
  // $(".main").css("marginRight", "20%");
  $("#rightTab").css("right", "20%");
  $("#bottomNav").css("width", "80%");
  rightNavIsOpen = !rightNavIsOpen;
}

function closeRightNav() {
  $("#rightNav").css("width", "0");
  $(".main").css("marginRight", "0");
  $("#rightTab").css("right", "0");
  $("#bottomNav").css("width", "100%");
  rightNavIsOpen = !rightNavIsOpen;
}

function openArtNav() {
  $("#artistPage").slideDown(500);
}

function closeArtNav() {
  $("#artistPage").slideUp(500);
}

function showResults() {
  $("#searchResults").css("visibility", "visible");
  resultsHidden = false;
}

function hideResults() {
  $("#searchResults").css("visibility", "hidden");
  resultsHidden = true;
}

function hideResults() {
  $("#searchResults").css("visibility", "hidden");
  resultsHidden = true;
}

var debouncedAjax = _.debounce((search) => { performSearch(search) }, 300);

function performSearch(search) {
  $("#searchResults").empty();
  searchArtists(search);
  searchReleases(search);
}

function searchArtists(search) {
  discogsCall.artistFindAPI(search).then((resp) => {
    var sr = discogsCall.newSR(resp.results);
    $("#searchResults").append("<p>Artists</p>");
    var noDuplicatesArtist = _.uniqBy(sr.artist, (list) => { return list.title; });
    noDuplicatesArtist.slice(0,3).forEach((elem) => {
      displaySearch(elem.thumb, elem.title, "artist", elem.id);
    });
  });
}

function searchReleases(search) {
  discogsCall.singlesFindAPI(search).then((resp) => {
    var sr = discogsCall.newSR(resp.results);
    /* TODO FIX THIS <HR> MONSTROSITY */
    $("#searchResults").append("<hr><p>Releases</p>");
    var noDuplicatesRelease = _.uniqBy(sr.release, (list) => { return list.title; });
    noDuplicatesRelease.slice(0,7).forEach((elem) => {
      displaySearch(elem.thumb, elem.title, "release", elem.id)
    });
  });
}

function displaySearch(pic, title, type, id) {
  var newDiv        =     $("<div>");
  var leftDiv       =     $("<div>");
  var rightDiv      =     $("<div>");
  var newImg        =     $("<img>");

  newDiv.addClass("row search-line");
  leftDiv.addClass("search-image-holder col-xs-3");
  rightDiv.addClass("col-xs-9");
  newImg.addClass("search-image")
  newDiv.attr('data-id', id);
  newDiv.attr('data-type', type);
  newDiv.attr('title', title);
  newImg.attr("src", picOrEmpty(pic));
  leftDiv.append(newImg);
  rightDiv.text(title);
  newDiv.append(leftDiv);
  newDiv.append(rightDiv);
  $("#searchResults").append(newDiv);
}

function picOrEmpty(pic) {
  return pic || "assets/images/empty.jpg";
}

function displayArtist(pic, title, id) {
  displaySearch(pic, title, "artist", id);
}

function clearSearchResults(){
  $('#searchBox').val('');
  $('#searchResults').empty();
  hideResults();
}

function hasChildren(element){
  return (element.children().length == 0) ? false : true;
}

function setArtistInfo(id) {
  $("#aboutArtist").empty();
  discogsCall.artistAPI(id).then((resp) => {
    $("#artistImage").attr("src", resp.thumb)
    $("#aboutArtist").append(resp.profile);
  });
}

function setTopSingles(artist) {
  $("#topSingles").empty();
  discogsCall.singlesFindAPI(artist).then((resp) => {
    var sr = discogsCall.newSR(resp.results);
    var noDuplicatesRelease = _.uniqBy(sr.release, function(list) { return list.title; });
    noDuplicatesRelease.forEach(function(elem, index) {
      $("#topSongs").append("<p>" + (index + 1) + ". " + elem.title + "</p>");
    });
  });
}

function setConcerts(artist) {
  $("#upcomingConcerts").empty();
  bandsInTown.searchAPI(artist).then((bitData) => {
    bitData.forEach((elem) => {
      var newDiv = createConcertTag(elem);
      $("#upcomingConcerts").append(newDiv);
    });
  });
}

function createConcertTag(conObj) {
  var newDiv = $("<div>");
  newDiv.addClass("concert-info col-md-4 col-sm-6");
  newDiv.append(moment(conObj.date).format("ddd MMMM D, YYYY - h:mm A"));
  newDiv.append("<br>");
  newDiv.append(conObj.venue);
  newDiv.append("<br>");
  newDiv.append(conObj.city + ", " + conObj.region);
  newDiv.append("<br>");
  newDiv.append("<a target='_blank' href ='" + conObj.ticketURL + "'>Buy Tickets</a>");
  return newDiv;
}

function setSingle(id) {
  discogsCall.releaseAPI(id).then(function(res) {
    var mainScreen   =   $('#mainScreen');
    var url = res.videos[0].uri.slice(32);
    var iframe = createMainSongTag(url);
    mainScreen.html(iframe);
    clearSearchResults();
    $("#mainScreen").slideDown(250);
  });
}

function addTop(recObj) {
  var tmpObj = createSingleTag(recObj);
  $("#topSingles").append(tmpObj);
}

function addRecent(recObj) {
  var tmpObj = createSingleTag(recObj);
  $("#recSingles").append(tmpObj);
}

function createSingleTag(recObj) {
  var tmpDiv = $("<div>").addClass("col-xs-6 col-md-3");
  var tmpImg = $("<img>").attr("src", picOrEmpty(recObj.thumb));
  tmpImg.addClass("single-img");
  var inrDiv = $("<div>").addClass("caption");
  inrDiv.append($("<h3>").text(recObj.title));
  inrDiv.append($("<p>").addClass("artist").text(recObj.artistName));
  tmpDiv.append(tmpImg);
  tmpDiv.append(inrDiv);
  return tmpDiv;
}

function createMainSongTag(url) {
  var baseURL      =   'https://www.youtube.com/embed/'
  var youtubeURL   =   url + "?autoplay=1";
  var iframe       =   $('<iframe>');
  iframe.attr('src', baseURL + youtubeURL);
  iframe.attr('frameborder', '0');
  iframe.attr('width', '560');
  iframe.attr('height', '315');
  iframe.attr('allowfullscreen');
  iframe.addClass("vid-frame");
  return iframe;
}


function loadStations() {
  var stations = netRadio.stations();
  stations.forEach((elem) => {
    var tmpTag = $("<p>").addClass("station");
    tmpTag.attr("data-station", elem);
    tmpTag.text(elem);
    $("#stationList").append(tmpTag);
  });
}

loadStations();

$(".artist").on("click", openArtNav);

$("#closeArtist").on("click", closeArtNav);

$("#musicPlay").on("click", function() {
  if ($("#radio").attr("src") === "") {
    alert("Use the right tab to load a radio station!");
  } else {
    if (playing) {
      $("#radio")[0].pause();
      $("#playBtn").attr("class", "glyphicon glyphicon-play")
    } else {
      $("#radio")[0].play();
      $("#playBtn").attr("class", "glyphicon glyphicon-pause")
    }
    playing = !playing;
  }
});

$("#musicStop").on("click", function() {
  $("#radio").attr("src", "");
  $("#currentStation").text("");
  $("#playBtn").attr("class", "glyphicon glyphicon-play");
  $("#radio")[0].pause();
  playing = false;
});

$("#searchBox").on("input", function() {
  event.preventDefault();
  var searchText = $("#searchBox").val();
  if (searchText === "") {
    resultsHidden = true;
    $("#searchResults").css("visibility", "hidden");
  } else {
    event.preventDefault();
    resultsHidden = false;
    $("#searchResults").css("visibility", "visible");
    debouncedAjax(searchText);
  }
});

// Search Icon Function
$("#search").on("click", function() {
  var isHidden = resultsHidden;
  if (hasChildren($('#searchResults'))){
    setTimeout(function(){
      if (isHidden){
        $('#searchResults').css('visibility','visible');
        resultsHidden = false;
      }
    },100);
  }
});

$(".station").on("click", function() {
  currentStation = $(this).attr("value");
  $("#currentStation").text($(this).attr("station"));
  $("#radio").attr("src", currentStation);
  $("#radio")[0].play();
  $("#playBtn").attr("class", "glyphicon glyphicon-pause")
  playing = true;
});

// Adds youtube video to main screen
$('#searchResults').on('click', '.search-line', function() {
  var title = $(this).attr("title");
  var id = $(this).attr('data-id');
  var type = $(this).attr("data-type");

  if (type === "artist") {
    $("#artistPage").slideDown(500);
    var tempImg = $(this).find("img").attr("src");
    $("#artistImage").attr("src", tempImg);
    setArtistInfo(id);
    setTopSingles(title);
    setConcerts(title);
  } else if (type === "release") {
    setSingle(id);
    incrSong(title, parseInt(id));
    lastSearch(parseInt(id));
  }
});

$(".station").on("click", function() {
  currentStation = $(this).attr("data-station");
  $("#currentStation").text($(this).attr("station"));
  $("#radio").attr("src", netRadio.getUrl(currentStation));
  $("#radio")[0].play();
  $("#playBtn").attr("class", "glyphicon glyphicon-pause")
  playing = true;
});

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

$("#musicSearch").submit(function() {
  event.preventDefault();
});

$(document).on('click', function() {
  if (!resultsHidden) {
    hideResults();
  }
});
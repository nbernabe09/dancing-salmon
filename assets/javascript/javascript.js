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

$("#mainScreen").hide();

// Functions
function leftNav(val) {
  $("#leftNav").css("width", val);
  $(".main").css("marginLeft", val);
  $("#leftTab").css("left", val);
  $("#navbar").css("marginLeft", val);
  leftNavIsOpen = !leftNavIsOpen;
}

function closeLeftNav() {
  leftNav("0");
}

function openLeftNav() {
  leftNav("20%");
}

function rightNav(valAr) {
  $("#rightNav").css("width", valAr[0]);
  $("#rightTab").css("right", valAr[1]);
  $("#bottomNav").css("width", valAr[2]);
  rightNavIsOpen = !rightNavIsOpen;
}

function openRightNav() {
  rightNav(["20%", "20%", "80%"]);
}

function closeRightNav() {
  rightNav(["0", "0", "100%"]);
}

function openArtNav() {
  closeMainScreen();
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

var debouncedAjax = _.debounce((search) => { performSearch(search) }, 300);

function performSearch(search) {
  $("#searchResults").empty();
  searchArtists(search);
  searchReleases(search);
}

function searchArtists(searchTerm) {
  search(searchTerm, "artistFindAPI", "<p>Artists</p>", 3, "artist");
}

function searchReleases(searchTerm) {
  search(searchTerm, "singlesFindAPI", "<p>Releases</p>", 7, "release");
}

function search(search, api, header, num, type) {
  discogsCall[api](search).then((resp) => {
    var sr = discogsCall.newSR(resp.results);
    $("#searchResults").append(header);
    var noDuplicatesArtist = _.uniqBy(sr[type], (list) => { return list.title; });
    noDuplicatesArtist.slice(0,num).forEach((elem) => {
      displaySearch(elem.thumb, elem.title, type, elem.id);
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

function saveArtist(id, thumb, after) {
  discogsCall.artistAPI(id).then((resp) => {
    var artistObj = {};
    artistObj["id"] = resp.id || "";
    artistObj["name"] = resp.name || "";
    artistObj["releases_url"] = resp.releases_url || "";
    artistObj["uri"] = resp.uri || "";
    artistObj["urls"] = resp.urls || "";
    artistObj["thumb"] = thumb || "";
    addArtist(artistObj);
    return artistObj;
  }).then((val) => { after(val); });
}

function saveSong(id, thumb, after) {
  discogsCall.releaseAPI(id).then((resp) => {
    if(!(resp.artists[0].id && resp.artists[0].name)) return;
    var releaseObj = {};
    releaseObj["id"] = resp.id || "";
    releaseObj["title"] = resp.title || "";
    releaseObj["genres"] = resp.genres || "";
    releaseObj["artistId"] = resp.artists[0].id || "";
    releaseObj["artistName"] = resp.artists[0].name || "";
    releaseObj["styles"] = resp.styles || "";
    releaseObj["uri"] = resp.uri || "";
    releaseObj["videos"] = resp.videos || "";
    releaseObj["thumb"] = thumb || "";
    addSong(releaseObj);
    return releaseObj;
  }).then((val) => { after(val); });
}

function setTopSingles(artist) {
  $("#topSongs").empty();
  discogsCall.singlesFindAPI(artist).then((resp) => {
    var sr = discogsCall.newSR(resp.results);
    var noDuplicatesRelease = _.uniqBy(sr.release, (list) => { return list.title; });
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

function loadArtist(name, src) {
  $("#artistImage").attr("src", src);
  setTopSingles(name);
  setConcerts(name);
  openArtNav();
}

function setSingle(id) {
  var proc = (val) => {
    if(!val.videos) return;
    var url = val.videos[0].uri.slice(32);
    var iframe = createMainSongTag(url);
    $('#mainScreen').html(iframe);
    clearSearchResults();
    openMainScreen();
  }
  getSong(id, proc);
}

function openMainScreen() {
   $("#mainScreen").slideDown(250);
}

function closeMainScreen() {
   $("#mainScreen").slideUp(250);
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
  var tmpDiv = $("<div>").addClass("col-xs-6 col-md-3 singles");
  var tmpImg = $("<img>").attr("src", picOrEmpty(recObj.thumb))
                         .addClass("song")
                         .attr("data-id", recObj.id);

  tmpImg.addClass("single-img");
  var inrDiv = $("<div>").addClass("caption");
  inrDiv.append($("<h3>").addClass("song single-title")
                        .text(recObj.title)
                        .attr("data-id", recObj.id));
  inrDiv.append($("<p>").addClass("artist")
                        .text(recObj.artistName)
                        .attr("data-id", recObj.artistId));
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

$("#closeArtist").on("click", closeArtNav);

$("#musicPlay").on("click", () => {
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

$("#musicStop").on("click", () => {
  $("#radio").attr("src", "");
  $("#currentStation").text("");
  $("#playBtn").attr("class", "glyphicon glyphicon-play");
  $("#radio")[0].pause();
  playing = false;
});

$("#searchBox").on("input", () => {
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
$("#search").on("click", () => {
  var isHidden = resultsHidden;
  if (hasChildren($('#searchResults'))){
    setTimeout(() => {
      if (isHidden){
        $('#searchResults').css('visibility','visible');
        resultsHidden = false;
      }
    },100);
  }
});

// Adds youtube video to main screen
$('#searchResults').on('click', '.search-line', function() {
  var title = $(this).attr("title");
  var id = $(this).attr('data-id');
  var type = $(this).attr("data-type");
  var tempImg = $(this).find("img").attr("src");


  if (type === "artist") {
    saveArtist(id, tempImg, (obj) => { loadArtist(obj["name"], obj["thumb"]); });
  } else if (type === "release") {
    incrSong(parseInt(id));
    lastSearch(parseInt(id));
    saveSong(id, tempImg, (obj) => { setSingle(obj["id"]); });
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
$("#rightTab").on("click", () => {
  if (rightNavIsOpen) { closeRightNav(); } 
  else { openRightNav(); }
});

$("#leftTab").on("click", () => {
  if (leftNavIsOpen) { closeLeftNav(); } 
  else { openLeftNav(); }
});

$("#musicSearch").submit(() => {
  event.preventDefault();
});

$(document).on('click', () => {
  if (!resultsHidden) { hideResults(); }
});

$(document).on("click", ".artist", function() {
   var name = $(this).text();
   var proc = (obj) => {
    if(!obj) {
      discogsCall.artistFindAPI(name)
                 .then((resp) => {
                   var tmpImg = resp.results[0].thumb;
                   if(tmpImg) {
                     saveArtist(id, tmpImg, (obj) => { loadArtist(obj["name"], obj["thumb"]); });
                   }
                 });
    } else {
      var thumb = obj.thumb || "";
      loadArtist($(this).text(),thumb);
    }
   }
   var id = parseInt($(this).attr("data-id"));
   getArtist(id, proc);
});

$(document).on("click", ".song", function() {
   var id = $(this).attr("data-id");
   setSingle(id);
});

$(document).keyup(function(e) {
  if (e.keyCode === 27) closeArtNav(); closeMainScreen(); closeRightNav();  // esc
});

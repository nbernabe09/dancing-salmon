// Global Variables
var artistIsOpen = false;
var playing = false;
var resultsHidden = true;
var title = "";
var currentStation = "";
var discogsCall = new DiscogsAPIUtil();
var netRadio    = new NetRadio();
var bandsInTown = new BitAPI();
var bbParser = new BBCodeHTML();

$(document).ready(function() {
  $("#videoPlayer").hide();
});

// Functions
function openArtNav() {
  $("#artistPage").css("width", "20rem");
  $("#closeArtistFade").fadeIn(400);
  artistIsOpen = true;
}

function closeArtNav() {
  $("#artistPage").css("width", "0");
  $("#closeArtistFade").fadeOut(400);
  artistIsOpen = false;
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
    artistObj["profile"] =  resp.profile || "";
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
  newDiv.addClass("concert-info");
  newDiv.append(moment(conObj.date).format("ddd MMMM D, YYYY - h:mm A"));
  newDiv.append("<br>");
  newDiv.append(conObj.venue);
  newDiv.append("<br>");
  newDiv.append(conObj.city + ", " + conObj.region);
  newDiv.append("<br>");
  newDiv.append("<a target='_blank' href ='" + conObj.ticketURL + "'>Buy Tickets</a>");
  return newDiv;
}

function loadArtist(name, src, id) {
  $("#artistImage").attr("src", src);
  setProfile(id); // new line
  setTopSingles(name);
  setConcerts(name);
  setArtistName(name);
  openArtNav();
}

function setArtistName(name) {
  $("#artistName").text(name);
}

function setProfile(id) {
  var proc = function(resp) {
    /* load take out bb code load */
    var convert = bbParser.bbcodeToHtml(resp.profile);
    convertDiscogsBBCode(convert).then((nonBBHtml)=>{
      $('#aboutArtist').html(nonBBHtml);
    });
  };
  getArtist(id, proc);
}

function setSingle(id) {
  var proc = (val) => {
    if(!val.videos) return;
    var url = val.videos[0].uri.slice(32);
    var iframe = createMainSongTag(url);
    $('#mainScreen').html(iframe);
    clearSearchResults();
    openVideoPlayer();
  }
  getSong(id, proc);
}

function openVideoPlayer() {
   $("#videoPlayer").slideDown(250);
}

function closeVideoPlayer() {
   $("#videoPlayer").slideUp(250);
   $("#mainScreen").empty();
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
  var tmpDiv = $("<div>").addClass("col text-center singles");
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
  if (playing) {
    $("#radio")[0].pause();
    $("#playBtn").attr("class", "ion-play");
    $("#musicPlay").attr("class", "btn btn-success");
    playing = false;
  }
  var baseURL      =   'https://www.youtube.com/embed/'
  var youtubeURL   =   url + "?autoplay=1";
  var iframe       =   $('<iframe>');
  $('#mainScreen').addClass("video-wrapper");
  iframe.attr('src', baseURL + youtubeURL);
  iframe.attr('frameborder', '0');
  iframe.attr('allowfullscreen');
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
    // console.log("Use the right tab to load a radio station!");
  } else {
    if (playing) {
      $("#radio")[0].pause();
      $("#playBtn").attr("class", "ion-play");
      $("#musicPlay").attr("class", "btn btn-success");
    } else {
      $("#radio")[0].play();
      $("#playBtn").attr("class", "ion-pause");
      $("#musicPlay").attr("class", "btn btn-info");
    }
    playing = !playing;
  }
});

$("#musicStop").on("click", () => {
  $("#radio").attr("src", "");
  $("#currentStation").text("");
  $("#playBtn").attr("class", "ion-play");
  $("#musicPlay").attr("class", "btn btn-secondary");
  $("#musicPlay").attr("data-toggle", "tooltip");
  $("#musicPlay").attr("title", "Please load a radio station!");
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
    saveArtist(id, tempImg, (obj) => { loadArtist(obj["name"], obj["thumb"], id); });
  } else if (type === "release") {
    incrSong(parseInt(id));
    lastSearch(parseInt(id));
    saveSong(id, tempImg, (obj) => { setSingle(obj["id"]); });
  }
});

$(".station").on("click", function() {
  currentStation = $(this).attr("data-station");
  $("#currentStation").text(currentStation);
  $("#radio").attr("src", netRadio.getUrl(currentStation));
  $("#radio")[0].play();
  $("#playBtn").attr("class", "ion-pause");
  $("#musicPlay").attr("class", "btn btn-info");
  $("#musicPlay").removeAttr("data-toggle");
  $("#musicPlay").removeAttr("title");
  playing = true;
});

// Buttons
$("#artistBtn").on("click", openArtNav);

$("#closeArtistBottom").on("click", closeArtNav);

$("#closeArtistFade").on("click", closeArtNav);

$("#musicSearch").submit(() => {
  event.preventDefault();
});

$(document).on('click', () => {
  if (!resultsHidden) { hideResults(); }
});

$(document).on("click", "#close-video", function() {
  closeVideoPlayer()
});

$(document).on("click", ".artist", function() {
   var name = $(this).text();
   var id = parseInt($(this).attr("data-id"));
   var proc = (obj) => {
   if(!obj) {
      discogsCall.artistFindAPI(name)
                 .then((resp) => {
                   var tmpImg = resp.results[0].thumb;
                   if(tmpImg) {
                     saveArtist(id, tmpImg, (obj) => { loadArtist(obj["name"], obj["thumb"], id); });
                   }
                 });
    } else {
      var thumb = obj.thumb || "";
      loadArtist($(this).text(), thumb, id);
    }
   }
   getArtist(id, proc);
});

$(document).on("click", ".song", function() {
   var id = $(this).attr("data-id");
   setSingle(id);
});

$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    closeArtNav();
    closeVideoPlayer();
  }  // esc
});

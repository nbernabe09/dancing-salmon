// dict = {"id": id};
var config = {
  apiKey: "AIzaSyDUt5rSSC7kQ6tDKn6MAd6ifSsk_sk5PdA",
  authDomain: "song-search-cfdaf.firebaseapp.com",
  databaseURL: "https://song-search-cfdaf.firebaseio.com",
  projectId: "song-search-cfdaf",
  storageBucket: "song-search-cfdaf.appspot.com",
  messagingSenderId: "36762759023"
};

// $.getScript("https://www.gstatic.com/firebasejs/4.2.0/firebase.js")

firebase.initializeApp(config);

var database = firebase.database();

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

function updateFB(ref, obj) {
   ref.update(obj);
}

function updateRecent(obj) {
   var dbRef = database.ref("recent");
   updateFB(dbRef, obj);
}

function lastSearch(id) {
   var time = Date.now();
   var update = {};
   update[time] = id;
   updateRecent(update);
}

function removeSpecial(string) {
  var spec = [".", "#", "$", "/", "[", "]"];
  spec.forEach((elem) => { string = string.replace(elem, ""); });
  return string;
}

function incrSong(song, id) {
  var dbRef = database.ref("songs");
  song = removeSpecial(song);
  dbRef.transaction(function(dict) {
    if(!dict) dict = {};
    if(song in dict) {
      dict[song]["count"]++;
    } else {
      dict[song] = {};
      dict[song]["id"] = id;
      dict[song]["count"] = 1;
    }
    return dict; 
  });
}

function topTerms(num, proc) {
   num = num || 10;
   firebase.database()
           .ref("songs")
           .orderByValue()
           .limitToLast(num)
           .once('value')
           .then((snapshot) => {
             proc(snapshot.val());
           });
}

function recentSearches(num, proc) {
   num = num || 10;
   firebase.database()
           .ref('recent')
           .orderByKey()
           .limitToLast(1)
           .once('value')
           .then((snapshot) => {
             proc(snapshot.val());
           });
}

var songs = database.ref("songs");
songs.orderByChild("count").limitToLast(4).on("value", function(snapshot) {
   val = snapshot.val();
   $("#topSingles").empty();
   for(var prop in val) {
      discogsCall.releaseAPI(val[prop].id)
                 .then((val) => { 
                    var passer = {}; 
                    passer["id"]    = val.id;
                    passer["title"] = val.title;
                    if(!val.thumb) {
                      giphyApi.giphyRequest(val.title)
                              .then((resp) => {
                                var respObj  = giphyApi.respToGifObj(resp.data[0]);
                                var giphyGif = giphyApi.newGiphyGif(respObj);
                                passer["thumb"] = giphyGif.still;
                              });
                    } else {
                      passer["thumb"] = val.thumb;
                    }
                    return passer;
                  })
                 .then((passer) => {
                    discogsCall.releaseToArtist(passer.id)
                               .then((val) => {
                                 passer["artistName"] = val.name;
                                 passer["artistId"]   = val.id;
                                 addTop(passer);
                               });
                 });
   }
});

var recent = database.ref("recent");
recent.orderByKey().limitToLast(4).on("value", function(snapshot) {
   val = snapshot.val();
   $("#recSingles").empty();
   for(var prop in val) {
      discogsCall.releaseAPI(val[prop])
                 .then((val) => { 
                    var passer = {}; 
                    passer["id"]    = val.id;
                    passer["title"] = val.title;
                    if(val.thumb) {
                      passer["thumb"] = val.thumb;
                    }
                    return passer;
                  })
                 .then((passer) => {
                    discogsCall.releaseToArtist(passer.id)
                               .then((val) => {
                                  if(passer.thumb === undefined) {
                                    giphyApi.giphyRequest(val.name)
                                            .then((resp) => {
                                              var respObj  = giphyApi.respToGifObj(resp.data[0]);
                                              var giphyGif = giphyApi.newGiphyGif(respObj);
                                              passer["thumb"] = giphyGif.still;
                                              passer["artistName"] = val.name;
                                              passer["artistId"]   = val.id;
                                              addRecent(passer);
                                            });
                                  } else {
                                    passer["artistName"] = val.name;
                                    passer["artistId"]   = val.id;
                                    addRecent(passer);
                                  }
                               });
                 });
   }
});
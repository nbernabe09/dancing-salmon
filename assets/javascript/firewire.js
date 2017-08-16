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

function updateSong(id, obj) {
  var dbRef = database.ref("songs/" + id);
  updateFB(dbRef, obj);
}

function addSong(obj) {
  if(obj.id) updateSong(obj.id, obj);
}

function updateArtist(id, obj) {
  var dbRef = database.ref("artists/" + id);
  updateFB(dbRef, obj);
}

function addArtist(obj) {
  if(obj.id) updateArtist(obj.id, obj);
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

function incrSong(id) {
  var dbRef = database.ref("searchCount");
  dbRef.transaction(function(dict) {
    if(!dict) dict = {};
    if(id in dict) { dict[id]++; }
      else { dict[id] = 1; }
    return dict; 
  });
}

function topTerms(num, proc) {
   num = num || 10;
   database.ref("searchCount")
           .orderByValue()
           .limitToLast(num)
           .once('value')
           .then((snapshot) => {
             proc(snapshot.val());
           });
}

function recentSearches(num, proc) {
   num = num || 10;
   database.ref('recent')
           .orderByKey()
           .limitToLast(1)
           .once('value')
           .then((snapshot) => {
             proc(snapshot.val());
           });
}

function getSong(id, proc) {
  if(!id) return;
  database.ref("songs/" + id)
          .once('value')
          .then((snapshot) => {
            var val = snapshot.val();
            if(val === null) {
              getSong(id, proc);
            } else {
              proc(val);
            }
          });
}

function getArtist(id, proc) {
  if(!id) return;
  database.ref("artists/" + id)
          .once('value')
          .then((snapshot) => {
            proc(snapshot.val());
          });
}

var songs = database.ref("searchCount");
songs.orderByValue().limitToLast(4).on("value", function(snapshot) {
   topSongs = snapshot.val();
   $("#topSingles").empty();

   var proc = (obj) => {
     var children = $("#topSingles").children();
     var length = children.length;
      if(length > 3) { 
        children.eq(0).remove();
        addTop(obj);
      } else {
       addTop(obj);
     }
   };

   for(var id in topSongs) { 
    getSong(id, proc);
   }
});

var recent = database.ref("recent");
recent.orderByKey().limitToLast(4).on("value", function(snapshot) {
   recSongs = snapshot.val();
   $("#recSingles").empty();

   var proc = (obj) => {
     addRecent(obj);
   };

   for(var prop in recSongs) { 
     getSong(recSongs[prop], proc);
   }
});
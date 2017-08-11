var config = {
    apiKey: "AIzaSyBjawp0OAUZrD_AiLzy4DnegoXCam6g2Xc",
    authDomain: "song-sling.firebaseapp.com",
    databaseURL: "https://song-sling.firebaseio.com",
    projectId: "song-sling",
    storageBucket: "song-sling.appspot.com",
    messagingSenderId: "848666248371"
};

$.getScript("https://www.gstatic.com/firebasejs/4.2.0/firebase.js")

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

function lastSearch(phrase) {
   var time = Date.now();
   var update = {};
   update[time] = phrase;
   updateRecent(update);
}

function incrTerm(term) {
  var dbRef = database.ref("terms");
  dbRef.transaction(function(dict) {
     if(dict) {
       if(term in dict) { dict[term]++; }
       else { dict[term] = 0; }
     } else {
       dict = {};
       dict[term] = 0;
     }
       return dict;
   });
}

function topTerms(num, proc) {
   num = num || 10;
   firebase.database()
           .ref('terms')
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

var terms = database.ref("terms");
terms.on("value", function(snapshot) {
   val = snapshot.val();
   // Add code to update page
});

var recent = database.ref("recent");
recent.on("value", function(snapshot) {
   val = snapshot.val();
   // Add code to update page
});
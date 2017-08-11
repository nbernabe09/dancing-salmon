function DiscogsAPI(){

  this.searchAPI = function(term){
    var endpoint = '/database/search';
    var search   = '?q=' + term;
    var key      = '&key=' + 'JOwiPIVkZGKqzPMffeLo&secret=TTdaxTVwWBjataauUqtEjCGckNrSOmtk';
    var requestUri = search + key;
    return this.request(endpoint, requestUri, this.postToList);
  }

  this.artistAPI = function(artistId) {
    var endpoint = '/artists/';
    var requestUri = artistId;
    return this.request(endpoint, requestUri, this.postToList);
  }

  this.masterAPI = function(id) {
    var endpoint = '/masters/';
    var requestUri = id;
    return this.request(endpoint, requestUri, this.postToList);
  }

  this.request = function(endpoint, querystring){
    var baseurl = 'https://api.discogs.com';
    let discogPromise = new Promise((resolve,reject) => {
      $.ajax({
          url: baseurl + endpoint + querystring,
          method: "GET"
        }).done(function(response) {
          resolve(response);
        }).fail(function(response){
          reject(response);
        });
    })
    return discogPromise;
  }
}

function DiscogsArtist(dartObj) {
  this.bio        = dartObj.bio;
  this.realname   = dartObj.realname;
  this.artistname = dartObj.artistname;
  this.uri        = dartObj.uri;
  this.urls       = dartObj.urls;
  this.images     = dartObj.images;
}

function DiscogsMaster(dmastObj) {
  this.id         = dmastObj.id;
  
}

function SearchRequests(resultAr) {
  this.artist = [];
  this.master = [];
  resultAr.forEach((elem) => {
    if(elem.type === "artist" || elem.type === "master") {
      var tmpObj = {
        "title": elem.title,
        "id"   : elem.id,
        "uri"  : elem.uri
      };
      this[elem.type].push(tmpObj);
    }
  });
}

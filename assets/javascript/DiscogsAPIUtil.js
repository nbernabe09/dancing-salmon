function DiscogsAPIUtil() {
   function DiscogsArtist(dartReq) {
      this.bio        = dartReq.bio;
      this.realname   = dartReq.realname;
      this.artistname = dartReq.artistname;
      this.uri        = dartReq.uri;
      this.urls       = dartReq.urls;
      this.images     = dartReq.images;
   }

   // function ArtistRequestInfo(artReq) {
   //    this.id    = artReq.id;
   //    this.thumb = artReq.thumb;
   //    this.title = artReq.title;
   //    this.type  = artReq.type;
   // }

   // function MasterRequestInfo(mastReq) {
   //    this.id      = mastReq.id;
   //    this.thumb   = mastReq.thumb;
   //    this.title   = mastReq.title;
   //    this.type    = mastReq.type;
   //    this.country = mastReq.country;
   //    this.genre   = mastReq.genre;
   //    this.style   = mastReq.style;
   //    this.label   = mastReq.label;
   //    this.year    = mastReq.year;
   // }

   // function ReleaseRequestInfo(relReq) {
   //    this.id      = relReq.id;
   //    this.thumb   = relReq.thumb;
   //    this.title   = relReq.title;
   //    this.type    = relReq.type;
   //    this.country = relReq.country;
   //    this.genre   = relReq.genre;
   //    this.style   = relReq.style;
   //    this.label   = relReq.label;
   //    this.year    = relReq.year;
   // }

   // function LabelRequestInfo(labelReq) {
   //    this.id    = labelReq.id;
   //    this.thumb = labelReq.thumb;
   //    this.title = labelReq.title;
   //    this.type  = labelReq.type;
   // }

   var validQueryOpts  = {
      "query": { "desc": "Your search query." },
      "type": { "desc": "String. One of 'release', 'master', 'artist', 'label'." },
      "title": { "desc": "Search by combined “Artist Name - Release Title” title field." },
      "release_title": { "desc": "Search release titles." },
      "credit": { "desc": "Search release credits." },
      "artist": { "desc": "Search artist names." },
      "anv": { "desc": "Search artist ANV." },
      "label": { "desc": "Search label names." },
      "genre": { "desc": "Search genres." },
      "style": { "desc": "Search styles." },
      "country": { "desc": "Search release country." },
      "year": { "desc": "Search release year." },
      "format": { "desc": "Search formats." },
      "catno": { "desc": "Search catalog number." },
      "barcode": { "desc": "Search barcodes." },
      "track": { "desc": "Search track titles." },
      "submitter": { "desc": "Search submitter username." },
      "contributor": { "desc": "Search contributor usernames." },
   };

   this.validOpts = function listValidOpts() {
      for(var prop in validQueryOpts) {
         console.log(prop,"- ",validQueryOpts[prop].desc," (Optional)");
      }
   }

   function isValidOpt(opt) {
      return validQueryOpts.hasOwnProperty(opt);
   }

   function validateQueryOpts(opts) {
      for(var prop in opts) {
         if(!isValidOpt(prop)) return false;
      }
      return true;
   }

   function combineOpts(opts) {
      var tmpStr = "";
      for(var prop in opts) {
         tmpStr += "&" + prop + "=" + opts[prop];
      }
      return tmpStr.replace("&","?");
   }

   function spaceToPlus(string) {
      var numSpaces = (string.match(new RegExp(" ", "g")) || []).length;
      var tmpStr = string;
      for(var i = 0; i < numSpaces; i++) {
        tmpStr = tmpStr.replace(" ", "+");
      }
      return tmpStr;
   }

   function switchQuery(opts) {
      if(opts.hasOwnProperty("query")) {
         var tmpVal = opts.query;
         delete opts.query;
         opts.q = tmpVal;
      }
   }

   this.SearchRequests = function SearchRequests(resultAr) {
      resultAr.forEach((elem) => {
         var type = elem.type;
         if(!this[type]) this[type] = [];
         this[type].push(elem);
      });

      Object.defineProperty(this, 'getProps', {
          enumerable: false,
          value: (val) => { 
            if(!val) {
               return getProps(this);
            } else if(this.hasOwnProperty(val)) {
               return getProps(this[val]);
            }
         }
      });
   };

   this.newSR = function newSR(resultAr) {
      return new this.SearchRequests(resultAr);
   };

   function getProps(obj) {
      var props = [];
      for(var prop in obj) {
         props.push(prop);
      }
      return props;
   }

   this.searchAPI = function(opts) {
      if(!validateQueryOpts(opts)) {
         opts = {"query": "error"};
      }
      switchQuery(opts);
      opts["key"]  = 'JOwiPIVkZGKqzPMffeLo&secret=TTdaxTVwWBjataauUqtEjCGckNrSOmtk';
      var endpoint = '/database/search';
      var optsStr  = combineOpts(opts);
      return this.request(endpoint, optsStr, this.postToList);
   };

   this.queryAPI = function(term) {
      return this.searchAPI({"query": term})
   }

   this.artistAPI = function(id) {
      return this.request('/artists/', id);
   }

   this.masterAPI = function(id) {
      return this.request('/masters/', id);
   };

   this.releaseAPI = function(id) {
      return this.request('/releases/', id);
   }

   this.labelAPI = function(id) {
      return this.request('/label/', id);
   }

   this.request = function(endpoint, querystring) {
      var baseurl = 'https://api.discogs.com';
      let discogPromise = new Promise((resolve,reject) => {
        $.ajax({
           url: baseurl + endpoint + querystring,
           method: "GET"
        }).done(function(response) {
           resolve(response);
        }).fail(function(response) {
           reject(response);
        });
      });
      return discogPromise;
   };
}
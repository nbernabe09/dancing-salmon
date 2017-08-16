function DiscogsAPIUtil() {

   function replaceAccents(s)
   {
       var s;

       var diacritics =[
           /[\300-\306]/g, /[\340-\346]/g,  // A, a
           /[\310-\313]/g, /[\350-\353]/g,  // E, e
           /[\314-\317]/g, /[\354-\357]/g,  // I, i
           /[\322-\330]/g, /[\362-\370]/g,  // O, o
           /[\331-\334]/g, /[\371-\374]/g,  // U, u
           /[\321]/g, /[\361]/g, // N, n
           /[\307]/g, /[\347]/g, // C, c
       ];

       var chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

       for (var i = 0; i < diacritics.length; i++)
       {
           s = s.replace(diacritics[i],chars[i]);
       }

       return s;
   }

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

   this.artistFindAPI = function(artist) {
      return this.searchAPI({"query": artist, "type": "artist"});
   }

   this.singlesFindAPI = function(artist) {
      return this.searchAPI({"query": artist, "format": "single"});
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

   this.releaseToArtist = function(id) {
      let artPromise = new Promise((resolve, reject) => {
         var resp = this.releaseAPI(id);
         resp.then((val) => {
            resolve(val.artists[0]);
         });
      });
      return artPromise;
   }

   this.request = function(endpoint, querystring) {
      var baseurl = 'https://api.discogs.com';
      var totalUrl = baseurl + endpoint + querystring;
      totalUrl = spaceToPlus(totalUrl);
      totalUrl = replaceAccents(totalUrl);
      let discogPromise = new Promise((resolve,reject) => {
        $.ajax({
           url: totalUrl,
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
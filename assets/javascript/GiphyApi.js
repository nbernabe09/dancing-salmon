function GiphyGif() {
  var gifs = {};

  var prefetches = [];

  function preFetch(img) {
      var tmpImg = new Image();
      tmpImg.src = img;
      prefetches[prefetches.length++] = tmpImg;
  }

  function GiphyGif(giphyObj) {
      this.term   = giphyObj.term;
      this.id     = giphyObj.id;
      this.url    = giphyObj.url;
      this.rating = giphyObj.rating;
      this.time   = giphyObj.time;
      this.width  = giphyObj.width;
      this.height = giphyObj.height;
      this.frames = giphyObj.frames;
      this.still  = giphyObj.still;
      this.gif    = giphyObj.gif;
  }

  this.newGiphyGif = (giphyObj) => { return new GiphyGif(giphyObj) };

  this.respToGifObj = function responseToGifObj(response) {
      var retObj = {};
      retObj.id        = response.id || "";
      retObj.url       = response.url || "";
      retObj.rating    = response.rating || "";
      retObj.time      = response.import_datetime || "";
      retObj.width     = response.images.original.width || "";
      retObj.height    = response.images.original.height || "";
      retObj.frames    = response.images.original.frames || "";
      retObj.gif       = response.images.original.url || ""
      retObj.still     = response.images.original_still.url || "";
      retObj.term      = null;
      return retObj;
  }

  this.giphyRequest = function giphySearchRequest(term, limit, offset) {
    limit = limit || 10;
    offset = offset || 0;
    var url = "https://api.giphy.com/v1/gifs/search?";
    var apiKey = "e0f9e9a67f0943e686f5b76a7d2a2922";
    url += "api_key=" + apiKey;
    url += "&q=" + term;
    url += "&limit=" + limit;
    url += "&offset=" + offset;
    url += "&rating=" + "PG-13";
    url += "&language=" + "en";

    let giphyPromise = new Promise((resolve,reject) => {
      $.ajax({
         url: url,
         method: "GET"
      }).done(function(response) {
         resolve(response);
      }).fail(function(response) {
         reject(response);
      });
    });
    return giphyPromise;
  }

  function addImages(term, offset) {
      var proc = function(response) {
          response.data.forEach(function(resp) {
              var gifObj = responseToGifObj(resp);
              gifObj.term = term;
              var giphyGif = new GiphyGif(gifObj);
              gifs[giphyGif.id] = giphyGif;
              var tmpImg = makeImage(term, giphyGif);
              preFetch(giphyGif.gif);
              $("#photos").prepend(tmpImg);
          });
      }
      giphySearchRequest(term, 10, offset * 10, proc);
  }

  $(document).keyup(function(e) {
    if (e.keyCode === 13) closeNav(), addTerm();      // enter
    if (e.keyCode === 27) closeNav();   // esc
  });
}
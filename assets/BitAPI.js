function BitAPI(){
  this.searchAPI = function(term){
    var endPoint      = '/artists/';
    var searchArtist  = term;
    var key           = '/events?&app_id=' + 'eyJUb2tlblR5cGUiOiJBUEkiLCJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxYzliNWFlNC0yMGNmLTRkYmMtOTM1ZS0wMTYwZGIzMzhlOGUiLCJpYXQiOjE1MDIyNTI2MTJ9.HBMdg03Ju7wrkgntzupM7dM2OVjn59vOzppVujs1CAwqHYtTPsEBiC3onG7xOCxy-rD5MFqUByTX5S1fmzFNMQ';
    var bitData = [];
    return this.request(endPoint+term+key).then((resp)=>{
      resp.forEach((elem)=>{
        var tmpObj = this.bitObj(elem);
        bitData.push(tmpObj);
      });
      return bitData;
    });
  }

  this.request = function(endPoint){
    var baseurl            = 'https://rest.bandsintown.com';
    let bitPromise         = new Promise((resolve,reject) => {
      $.ajax({
          url    : baseurl + endPoint,
          method : "GET"
        }).done(function(response) {
          resolve(response);
        }).fail(function(response){
          reject(response);
        });
    });
    return bitPromise;
  }
  this.bitObj = function(obj){
    var tmpObj = {
      // artist  : obj.lineup[0],
      id         :  obj.id,
      ticketURL  :  obj.url,
      date       :  obj.datetime,
      city       :  obj.venue.city,
      region     : (obj.venue.country == 'United States') ? obj.venue.region : obj.venue.country,
      venue      :  obj.venue.name
    };
    return tmpObj;
  }
}
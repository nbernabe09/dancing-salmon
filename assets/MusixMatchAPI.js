function MusixMatchAPI(){
  this.searchAPI = function(term){
    var endPoint      = '/artists/';
    var searchArtist  = term;
    var key           = '/events?&app_id=' + '11af47268eaa52d4a2bb57db36259a15';
    var trackURL = 'https://tracking.musixmatch.com/t1.0/0Zpu4T-OtRXG9fsFv75as0Sh8vj5LhHpzaWoF3S6CpFw1aiNvmRgULHxdc9m9E7TQ6q0hBukBCc7yujiD4WqTKurx1NYqOHYdqDKLK_qxdte5xYnE7-qRAVjliXCfcljCQon38qRrRcHPa195XZuSc7xlvQoQUwDRpE5JM4W7Ng';
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
    var baseurl            = 'http://api.musixmatch.com/ws/1.1/';
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

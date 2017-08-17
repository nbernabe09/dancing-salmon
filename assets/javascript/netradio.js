function NetRadio() {
   var stationList =
      {"Alternative": "http://cabhs31.sonixcast.com:20254/;",
      "Classical": "http://whro.mediaplayer.whro.org/128",
      "Classic Rock": "http://s46.myradiostream.com:7608/;",
      "Country": "http://lynx.prostreaming.net:8004/stream/;",
      "Dance": "http://edmFeed.com:8000/edmFeed",
      "Easy Listening": "http://209.95.50.189:8074/stream/;",
      "Electronic": "http://188.165.244.10:27015/;",
      "Hawaiian": "http://184.173.142.117:15728/stream/1/;",
      "Hip-Hop/Rap": "http://streaming.radio.co/s900bb350d/listen",
      "J-Pop": "http://cabhs31.sonixcast.com:20002/;",
      "J-Rock": "http://cabhs30.sonixcast.com:9508/;",
      "K-Pop": "http://184.95.62.170:9026/;",
      "Oldies": "http://192.95.18.39:5336/stream/;",
      "R&B/Soul": "http://soulradio02.live-streams.nl",
      "Slow Jams": "http://ritetimeradio.filehostia.com:8582/;"}

   this.stations = () => { return Object.keys(stationList); };
   this.getUrl = (station) => { if(stationList.hasOwnProperty(station)) return stationList[station]; };
}

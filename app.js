var fs = require('fs');
var zlib = require("zlib");
var that = this;

zlib.unzip(fs.readFileSync(__dirname + '/data/world-cities.json.gz'), function(err, result){
    that.locations = JSON.parse(result.toString());
});

var R = 6371;
var haversine = function(lat1, lon1, lat2, lon2)
{
   var dLat = (lat2-lat1) * (Math.PI / 180);
   var dLon = (lon2-lon1) * (Math.PI / 180);
   lat1 = lat1 * (Math.PI / 180);
   lat2 = lat2 * (Math.PI / 180);

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c;

   return d;
};

exports.zip_lookup = function(zip)
{
   for (var i = 0; i < that.locations.length; i++)
   {
      if (that.locations[i].postalCode == zip)
         return that.locations[i];
   }

   return null;
};

exports.gps_lookup = function(lat, lng)
{
   var min_distance = 9999999999; // simulate infinity
   var min_location = {};

   if (that.locations) {
       for (var i = 0; i < that.locations.length; i++)
       {
           var distance = haversine(lat, lng, that.locations[i].latitude, that.locations[i].longitude);

           if (distance < min_distance)
           {
               min_location = that.locations[i];
               min_distance = distance;
           }
       }

       min_location.distance = min_distance;
       return min_location;
   } else {
       console.log("Something went wrong, locations were not defined.");
       return false;
   }

};

var express = require('express');
var fs = require('fs');
var app = express();

var locations = JSON.parse(fs.readFileSync('locations.json', 'ascii'));

var R = 6371;
var haversine = function(lat1, lon1, lat2, lon2)
{
   var dLat = (lat2-lat1) * (Math.PI / 180);
   var dLon = (lon2-lon1) * (Math.PI / 180);
   var lat1 = lat1 * (Math.PI / 180);
   var lat2 = lat2 * (Math.PI / 180);

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c;

   return d;
}

exports.zip_lookup = function(zip)
{
   for (var i = 0; i < locations.length; i++)
   {
      if (locations[i].zipcode == zip)
         return locations[i];
   }
}

exports.gps_lookup = function(lat, lng)
{
   var min_distance = 9999999999; // simulate infinity
   var min_location = {};
   
   for (var i = 0; i < locations.length; i++)
   {
      var distance = haversine(lat, lng, locations[i].latitude, locations[i].longitude); 

      if (distance < min_distance)
      {
         min_location = locations[i];
         min_distance = distance;

         console.log(min_location);
      }
   }

   return min_location;
}

app.get('/', function (req, res)
{
   res.send({
      "error": "Expecting coordinates. (/:lat/:lng)"
   });
});

app.get('/zip/:zip', function (req, res)
{
   var zip = req.params.zip;

   res.send(exports.zip_lookup(zip));
});

app.get('/gps/:lat/:lng', function (req, res)
{
   var lat = req.params.lat;
   var lng = req.params.lng;

   res.send(exports.gps_lookup(lat, lng));
});

app.listen(4000);
console.log('http://localhost:4000');
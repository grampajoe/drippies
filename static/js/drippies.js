var $ = require('jquery');

function showWeather(data) {
  var place = data.results[0];

  $('#location').val(place.formatted_address);
}
 
$('form').on('submit', function() {
  var query = $('#location').val();

  $.get(
    'http://maps.googleapis.com/maps/api/geocode/json',
    {'address': query},
    showWeather
  );

  return false;
});

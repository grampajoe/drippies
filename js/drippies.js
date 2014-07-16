var Drippies = function($) {
    this.$ = $;
};

// Returns a promise with a geocode result.
Drippies.prototype.geocode = function(address) {
    var $ = this.$,
        deferred = new $.Deferred();

    $.ajax({
      'method': 'GET',
      'url': 'https://maps.googleapis.com/maps/api/geocode/json',
      'data': {'address': address},
      'dataType': 'json',
      'success': function(data) {
        var result = data.results[0];
        deferred.resolve(
          result.geometry.location.lat,
          result.geometry.location.lng
        );
      },
      'error': function(xhr, textStatus, errorThrown) {
        deferred.reject(errorThrown);
      },
    });

    return deferred;
};

Drippies.prototype.getWeather = function(lat, lng) {
  var $ = this.$,
      deferred = new $.Deferred(),
      url = window.location.protocol + '//' + window.location.host + '/forecast/' + lat + ',' + lng;

  $.ajax({
    'method': 'GET',
    'url': url,
    'success': function(data) {
      deferred.resolve(data);
    },
    'error': function(xhr, textStatus, errorThrown) {
      deferred.reject(errorThrown);
    }
  });

  return deferred;
};

// Submit handler for the location form
Drippies.prototype.submit = function() {
  var self = this,
      $ = this.$,
      query = $('#location').val();

  self.geocode(query).then(function(lat, lng) {
    self.getWeather(lat, lng).then(function(weather) {
      $('#weather').html(weather);
    });
  });
};

// Initializes the app
Drippies.prototype.init = function() {
  var $ = this.$,
      self = this;

  $('form').on('submit', function() {
    self.submit();
    return false;
  });
};

module.exports = function($) {
  return new Drippies($);
};

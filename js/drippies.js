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
        deferred.resolve(data.results);
      },
      'error': function(xhr, textStatus, errorThrown) {
        deferred.reject(errorThrown);
      },
    });

    return deferred;
};

// Shows location choices
Drippies.prototype.showChoices = function(results) {
  var $ = this.$,
      self = this,
      $locations = $('#locations');

  function showWeather(weather) {
    self.showWeather(weather);
  }

  if (results.length === 1) {
    self.getWeather(
      results[0].geometry.location.lat,
      results[0].geometry.location.lng
    ).then(showWeather);
  }

  $.each(results, function(i, result) {
    var $loc = $('<a href="#">' + result.formatted_address + '</a>'),
        $el = $('<li></li>').append($loc),
        lat = result.geometry.location.lat,
        lng = result.geometry.location.lng;

    $loc.click(function() {
      self.getWeather(lat, lng).then(showWeather);
    });

    $locations.append($el);
  });
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

Drippies.prototype.showWeather = function(weather) {
  this.$('#weather').html(weather);
};

// Submit handler for the location form
Drippies.prototype.submit = function() {
  var self = this,
      $ = this.$,
      query = $('#location').val();

  function showChoices(results) {
    self.showChoices(results);
  }

  self.geocode(query).then(showChoices);
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

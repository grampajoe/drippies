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

  if (results.length === 1) {
    return self.chooseResult(results[0]);
  }

  $.each(results, function(i, result) {
    var address = result.formatted_address,
        $loc = $('<a href="#">' + address + '</a>'),
        $el = $('<li></li>').append($loc);

    $loc.click(function() {
      self.chooseResult(result);
    });

    $locations.append($el);
  });
};

Drippies.prototype.chooseResult = function(result) {
  var $ = this.$,
      self = this,
      lat = result.geometry.location.lat,
      lng = result.geometry.location.lng;

  function showWeather(weather) {
    self.showWeather(weather);
  }

  $('#locations').html('');
  $('#location').val(result.formatted_address);
  self.getWeather(lat, lng).then(showWeather);
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

var jQuery = require('jquery');

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
      'success': function(data) {
        deferred.resolve(data.results[0]);
      },
      'error': function(xhr, textStatus, errorThrown) {
        deferred.reject(errorThrown);
      },
    });

    return deferred;
};

// Initializes the app
Drippies.prototype.init = function() {
};

module.exports = Drippies;

var assert = require('assert'),
    jsdom = require('jsdom').jsdom,
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    jQuery = require('jquery'),
    Drippies = require('../drippies');

describe('Drippies', function() {
  var drippies;

  beforeEach(function() {
    var window = jsdom('<html></html>').createWindow(),
        $ = jQuery(window);

    $.support.cors = true
    $.ajaxSettings.xhr = function() {
      return new XMLHttpRequest();
    };

    drippies = new Drippies($);
  });

  describe('#geocode', function() {
    it('should call the Google geocode api', function(done) {
      drippies.geocode('NYC').then(function(result) {
        assert(result.formatted_address.match(/New York/));
        done();
      }).fail(function(err) {
        done(new Error(err));
      });
    });
  });
});

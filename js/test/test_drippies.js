var assert = require('assert'),
    jsdom = require('jsdom'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    jQuery = require('jquery'),
    Drippies = require('../drippies');

describe('Drippies', function() {
  var drippies,
      window,
      $;

  beforeEach(function(done) {
    jsdom.env({
      'html': '<html><body><form><input type="text" id="location"></form></body></html>',
      'url': 'http://localhost:5000',
      'done': function(err, window) {
        $ = jQuery(window);
        done();

        $.support.cors = true
        $.ajaxSettings.xhr = function() {
          return new XMLHttpRequest();
        };

        drippies = Drippies($);
      }
    });
  });

  describe('#geocode', function() {
    it('should call the Google geocode api', function(done) {
      drippies.geocode('NYC').then(function(lat, lng) {
        assert(lat > 40);
        assert(lng < 70);
        done();
      }).fail(function(err) {
        done(new Error(err));
      });
    });
  });

  describe('#getWeather', function() {
    it('should send a geocode result to the weather endpoint', function(done) {

      drippies.getWeather(40.123, -70.321).then(function(weather) {
        done();
      });
    });
  });

  describe('#init', function() {
    it('should attach a submit handler to the form', function(done) {
      drippies.submit = function() {
        done();
      };

      drippies.init();

      $('form').trigger('submit');
    });
  });
});

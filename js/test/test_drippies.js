var should = require('should'),
    jsdom = require('jsdom'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    jQuery = require('jquery'),
    express = require('express'),
    Drippies = require('../drippies');

describe('Drippies', function() {
  var drippies,
      window,
      $;

  beforeEach(function(done) {
    jsdom.env({
      'html':
        '<html><body>' +
        '<form><input type="text" id="location"></form>' +
        '<ul id="locations"></ul>' +
        '<p id="weather"></p>' +
        '</body></html>',
      'url': 'http://localhost:9189',
      'done': function(err, window) {
        global.window = window;
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
      drippies.geocode('NYC').then(function(results) {
        results.should.be.an.Array;
        done();
      }).fail(function(err) {
        done(new Error(err));
      });
    });
  });

  describe('#showChoices', function() {
    var fakeResults = [
      {
        'formatted_address': '123 Test St.',
        'geometry': {
          'location': {
            'lat': 12,
            'lng': -80,
          },
        },
      },
      {
        'formatted_address': '321 Butt St.',
        'geometry': {
          'location': {
            'lat': 8,
            'lng': -10,
          },
        },
      },
    ];

    it('should display results', function() {
      drippies.showChoices(fakeResults);

      var locations = $('#locations li');

      locations.should.have.length(2);
    });

    it('should make results links', function() {
      drippies.showChoices(fakeResults);

      var links = $('#locations li a');

      links.should.have.length(2);
    });

    it('should show the formatted address in the links', function() {
      drippies.showChoices(fakeResults);

      var links = $('#locations li a');

      links.slice(0, 1).text().should.eql(fakeResults[0].formatted_address);
      links.slice(1, 2).text().should.eql(fakeResults[1].formatted_address);
    });

    it('should get the weather when one is clicked', function(done) {
      drippies.getWeather = function(lat, lng) {
        var deferred = new $.Deferred();

        lat.should.eql(fakeResults[1].geometry.location.lat);
        lng.should.eql(fakeResults[1].geometry.location.lng);

        done();

        return deferred;
      };

      drippies.showChoices(fakeResults);
      $('#locations a').last().click();
    });

    it('should show the weather after it gets got', function(done) {
      drippies.showWeather = function(weather) {
        weather.should.eql('wow');

        done();
      };

      drippies.getWeather = function() {
        var deferred = new $.Deferred();

        deferred.resolve('wow');

        return deferred;
      };

      drippies.showChoices(fakeResults);
      $('#locations a').last().click();
    });

    it('should get the weather right away if only one result', function(done) {
      drippies.getWeather = function(lat, lng) {
        var deferred = new $.Deferred();

        lat.should.eql(fakeResults[0].geometry.location.lat);
        lng.should.eql(fakeResults[0].geometry.location.lng);

        done();

        return deferred;
      };

      drippies.showChoices(fakeResults.slice(0, 1));
    });

    it('should show the weather right away if only one result', function(done) {
      drippies.showWeather = function(weather) {
        weather.should.eql('wow');

        done();
      };

      drippies.getWeather = function() {
        var deferred = new $.Deferred();

        deferred.resolve('wow');

        return deferred;
      };

      drippies.showChoices(fakeResults.slice(0, 1));
    });
  });

  describe('#getWeather', function() {
    var server;

    beforeEach(function() {
      var app = express();

      app.get(/\/forecast\/.*/, function(req, res) {
        res.send('Forecast!');
      });

      server = app.listen(9189);
    });

    afterEach(function() {
      server.close();
    });

    it('should send a geocode result to the weather endpoint', function(done) {
      drippies.getWeather(40.123, -70.321).then(function(weather) {
        weather.should.eql('Forecast!');
        done();
      }).fail(function(err) {
        done(new Error(err));
      });
    });
  });

  describe('#showWeather', function() {
    it('should show the weather on the page', function() {
      var $weather = $('#weather');

      drippies.showWeather('fart butt');

      $weather.text().should.eql('fart butt');
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

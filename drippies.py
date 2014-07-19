import logging
import re
import os

import forecastio
from flask import Flask, render_template
from werkzeug.routing import BaseConverter


TRANSLATIONS = {
    'rain': 'drippies',
    'cloudy': 'fluff fluffs',
    'drizzle': 'pitter pats',
    'temperatures': 'hot\'n\'colds',
}


app = Flask(__name__)

@app.before_first_request
def setup_logging():
    log_handler = logging.StreamHandler()
    log_handler.setLevel(logging.INFO)
    app.logger.addHandler(log_handler)


def _translate(token):
    """Returns a translated (or not) version of a token."""
    small_token = token.lower()
    if small_token in TRANSLATIONS:
        replacement = TRANSLATIONS[small_token]
        if token[0].isupper():
            replacement = replacement.capitalize()
        token = replacement
    return token


def drippify(forecast):
    """Returns a silly version of a forecast."""
    tokens = re.split('(\W+)', forecast)

    result = [_translate(token) for token in tokens]

    return ''.join(result)


class LocationConverter(BaseConverter):
    """A URL parameter converter for location components."""
    def __init__(self, *args, **kwargs):
        super(LocationConverter, self).__init__(*args, **kwargs)
        self.regex = '(?:-?\d+\.\d+)'

    def to_python(self, value):
        return float(value)


app.url_map.converters['loc'] = LocationConverter


def get_forecast(lat, lng):
    """Returns the forecast for a given location as a string."""
    api_key = os.environ.get('FORECASTIO_API_KEY')

    if not api_key:
        raise Exception('No FORECASTIO_API_KEY set.')

    forecast = forecastio.load_forecast(api_key, lat, lng)

    minute = forecast.minutely().summary
    hour = forecast.hourly().summary
    day = forecast.daily().summary

    return '{} {} {}'.format(minute, hour, day)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/forecast/<loc:lat>,<loc:lng>')
def forecast(lat, lng):
    boring = get_forecast(lat, lng)
    return drippify(boring)


if __name__ == '__main__':
    app.run(debug=True)

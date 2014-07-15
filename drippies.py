import logging
import os

import forecastio
from flask import Flask, render_template
from werkzeug.routing import BaseConverter


app = Flask(__name__)

@app.before_first_request
def setup_logging():
    log_handler = logging.StreamHandler()
    log_handler.setLevel(logging.INFO)
    app.logger.addHandler(log_handler)


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
    return get_forecast(lat, lng)


if __name__ == '__main__':
    app.run(debug=True)

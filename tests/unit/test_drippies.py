import mock
import os

from drippies import get_forecast


class TestForecast(object):
    @mock.patch('drippies.forecastio')
    def test_get_forecast(self, forecastio):
        """Should use the forecastio library to get a forecast."""
        forecast = forecastio.load_forecast.return_value
        forecast.minutely.return_value.summary = 'Minute.'
        forecast.hourly.return_value.summary = 'Hour.'
        forecast.daily.return_value.summary = 'Day.'

        lat = 123
        lng = 321
        api_key = 'hello friend'

        with mock.patch.dict(os.environ, {'FORECASTIO_API_KEY': api_key}):
            result = get_forecast(lat, lng)

        forecastio.load_forecast.assert_called_with(api_key, lat, lng)
        assert result == 'Minute. Hour. Day.'

    def test_get_forecast_no_api_key(self):
        """Should raise an exception with no API key."""
        try:
            with mock.patch.dict(os.environ, {'FORECASTIO_API_KEY': ''}):
                get_forecast(123, 321)
        except Exception as ex:
            assert 'FORECASTIO_API_KEY' in str(ex)
        else:
            raise AssertionError('No exception raised.')

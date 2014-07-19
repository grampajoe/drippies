import mock
import pytest

from drippies import app


@pytest.fixture
def client():
    return app.test_client()


class TestDrippies(object):
    def test_index(self, client):
        """The index page should return a 200 response."""
        response = client.get('/')

        assert response.status_code == 200

    def test_index_title(self, client):
        """The index page should have the title "Drippies"."""
        response = client.get('/')

        assert '<title>Drippies</title>' in response.data.decode('utf-8')

    @mock.patch('drippies.get_forecast')
    def test_forecast(self, get_forecast, client):
        """The forecast endpoint should return a 200 response."""
        get_forecast.return_value = 'Cool'

        response = client.get('/forecast/40.0,-70.1')

        assert response.status_code == 200

    @mock.patch('drippies.get_forecast')
    def test_forecast_gets_forecast(self, get_forecast, client):
        """The forecast endpoint should get a forecast from the API."""
        get_forecast.return_value = 'Wow a forecast!'

        response = client.get('/forecast/40.0,-70.1')

        get_forecast.assert_called_with(40.0, -70.1)
        assert response.data.decode('utf-8') == get_forecast.return_value

    @mock.patch('drippies.get_forecast')
    def test_silliness(self, get_forecast, client):
        """Forecasts should be silly."""
        get_forecast.return_value = 'Rain tomorrow. Cloudy forever!!!'

        response = client.get('/forecast/10.0,-1.99')

        assert response.data.decode('utf-8') == 'Drippies tomorrow. Fluff fluffs forever!!!'

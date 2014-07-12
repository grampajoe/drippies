import pytest
from selenium import webdriver


BASE_URL = 'http://localhost:5000'


@pytest.fixture(scope='function')
def driver(request):
    driver = webdriver.Firefox()

    driver.implicitly_wait(5)

    def close_driver():
        driver.close()

    request.addfinalizer(close_driver)

    return driver


class TestDrippies(object):
    def test_index(self, driver):
        """The index page should return a response."""
        driver.get(BASE_URL + '/')

        assert 'Drippies' in driver.title

    def test_shows_weather_for_location(self, driver):
        """Entering a location and submitting should show the weather."""
        # Greg visits the index page
        driver.get(BASE_URL + '/')

        # And sees a big ol' text input
        field = driver.find_element_by_id('location')

        # He types in the name of his town
        field.send_keys('NYC')

        # Submits the form
        field.submit()

        # The text field is still there, prefilled with the name of his
        # town
        field = driver.find_element_by_id('location')
        assert field.get_attribute('value') == 'NYC'

        # There's also a nice blurb about the weather

        raise AssertionError('Finish it!!!')

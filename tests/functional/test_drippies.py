import os
import time

import pytest
from selenium import webdriver


BASE_URL = 'http://localhost:5000'


@pytest.fixture(scope='function')
def driver(request):
    profile = webdriver.FirefoxProfile()
    profile.add_extension(
        os.path.join(os.path.dirname(__file__), 'selenium/JSErrorCollector.xpi'),
    )

    driver = webdriver.Firefox(firefox_profile=profile)
    driver.implicitly_wait(5)

    def close_driver():
        # Let's check for errors
        errors = driver.execute_script('return window.JSErrorCollector_errors.pump()')
        driver.close()

        if errors:
            raise Exception(errors)

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

        # Waits patiently
        time.sleep(3)

        # The text field is still there, prefilled with the name of his
        # town
        field = driver.find_element_by_id('location')
        assert field.get_attribute('value') == 'NYC'

        # There's also a nice blurb about the weather
        weather = driver.find_element_by_id('weather')
        assert len(weather.text) > 0

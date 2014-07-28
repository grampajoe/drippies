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
    def submit_location(self, driver, location):
        """Submits a location to the location form."""
        field = driver.find_element_by_id('location')

        field.send_keys(location)
        field.submit()

        time.sleep(3)

    def assert_shows_the_weather(self, driver):
        # There's also a nice blurb about the weather
        weather = driver.find_element_by_id('weather')
        assert len(weather.text) > 0

    def test_index(self, driver):
        """The index page should return a response."""
        driver.get(BASE_URL)

        assert 'Drippies' in driver.title

    def test_shows_weather_for_location(self, driver):
        """Entering a location and submitting should show the weather."""
        # Greg visits the index page
        driver.get(BASE_URL)

        # He submits the name of his town
        self.submit_location(driver, 'NYC')

        # And there are no choices to choose
        locations = driver.find_elements_by_css_selector('#locations li')
        assert len(locations) == 0

        # The text field is still there, prefilled with the name of his
        # town
        field = driver.find_element_by_id('location')
        assert field.get_attribute('value') == 'New York, NY, USA'

        # And he sees the weather!
        self.assert_shows_the_weather(driver)

    def test_shows_location_choices(self, driver):
        """Submitting an ambiguous location should show choices."""
        # Francis loads up the site
        driver.get(BASE_URL)

        # They want to see weather for "Chester"
        self.submit_location(driver, 'Chester')

        # But the app is all like "WHICH CHESTER???"
        locations = driver.find_elements_by_css_selector('#locations a')

        # It shows him a bunch of choices
        assert len(locations) > 1

        # Francis sees that all the choices are, indeed, Chesters
        for location in locations:
            assert 'Chester' in location.text

        # He clicks on the last one
        location_name = locations[-1].text
        locations[-1].click()

        # Then he sees the locations disappear!
        locations = driver.find_elements_by_css_selector('#locations a')
        assert len(locations) == 0

        # And sees the location he chose in the box
        field = driver.find_element_by_id('location')
        assert field.get_attribute('value') == location_name

        # And waits a little bit
        time.sleep(3)

        # And sees his forecast!
        self.assert_shows_the_weather(driver)

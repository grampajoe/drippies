import pytest
from selenium import webdriver


BASE_URL = 'http://localhost:5000'


@pytest.fixture(scope='function')
def driver(request):
    driver = webdriver.Firefox()

    def close_driver():
        driver.close()

    request.addfinalizer(close_driver)

    return driver


class TestDrippies(object):
    def test_index(self, driver):
        """The index page should return a response."""
        driver.get(BASE_URL + '/')

        assert 'Drippies' in driver.title

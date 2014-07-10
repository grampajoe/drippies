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

        assert '<title>Drippies</title>' in str(response.data)
